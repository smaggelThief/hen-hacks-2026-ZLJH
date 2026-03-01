-- ============================================================
-- Plate Pass — Friends & Leaderboard Schema
-- Run this AFTER schema.sql and orders_migration.sql.
-- Supabase Dashboard → SQL Editor → New Query
-- ============================================================


-- --------------------------------------------------------
-- 1. FRIENDSHIPS TABLE
-- --------------------------------------------------------

create table if not exists public.friendships (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users on delete cascade not null,
  friend_id  uuid references auth.users on delete cascade not null,
  created_at timestamptz default now(),
  unique (user_id, friend_id)
);

alter table public.friendships enable row level security;


-- --------------------------------------------------------
-- 2. RLS POLICIES
-- --------------------------------------------------------

create policy "Users can read own friendships"
  on public.friendships for select
  to authenticated
  using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can insert own friendships"
  on public.friendships for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete own friendships"
  on public.friendships for delete
  to authenticated
  using (auth.uid() = user_id);


-- --------------------------------------------------------
-- 3. ADD FRIEND BY EMAIL — RPC
--    Looks up a user by email in auth.users (requires
--    SECURITY DEFINER to access auth schema), then inserts
--    a row into friendships. Returns the new friendship id.
-- --------------------------------------------------------

create or replace function public.add_friend_by_email(p_email text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_friend_id  uuid;
  v_friendship uuid;
begin
  select id into v_friend_id
    from auth.users
   where email = lower(trim(p_email));

  if not found then
    raise exception 'No user found with email: %', p_email;
  end if;

  if v_friend_id = auth.uid() then
    raise exception 'You cannot add yourself as a friend';
  end if;

  insert into friendships (user_id, friend_id)
  values (auth.uid(), v_friend_id)
  on conflict (user_id, friend_id) do nothing
  returning id into v_friendship;

  if v_friendship is null then
    raise exception 'Already friends with this user';
  end if;

  return v_friendship;
end;
$$;


-- --------------------------------------------------------
-- 4. GET LEADERBOARD — RPC
--    Returns the logged-in user + all their friends,
--    each with their completed delivery count, sorted
--    descending. Uses SECURITY DEFINER to read auth.users
--    emails for display names.
-- --------------------------------------------------------

create or replace function public.get_friends_leaderboard()
returns table (
  user_id    uuid,
  email      text,
  deliveries bigint,
  is_self    boolean
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with friend_ids as (
    select f.friend_id as uid from friendships f where f.user_id = auth.uid()
    union
    select auth.uid() as uid
  )
  select
    fi.uid                                          as user_id,
    u.email                                         as email,
    coalesce(count(o.id), 0)                        as deliveries,
    (fi.uid = auth.uid())                           as is_self
  from friend_ids fi
  join auth.users u on u.id = fi.uid
  left join orders o
    on o.volunteer_id = fi.uid
   and o.status = 'completed'
  group by fi.uid, u.email
  order by deliveries desc, u.email asc;
end;
$$;
