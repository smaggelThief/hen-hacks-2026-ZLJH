"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Leaf, LogOut } from "lucide-react"
import { LandingView } from "@/components/landing-view"
import { RestaurantView } from "@/components/restaurant-view"
import { UserView } from "@/components/user-view"
import { VolunteerView } from "@/components/volunteer-view"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

type RoleType = "restaurant" | "user" | "volunteer"

const ROLE_LABELS: Record<RoleType, string> = {
  restaurant: "Restaurant Dashboard",
  user: "User Dashboard",
  volunteer: "Volunteer Dashboard",
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const role = (user?.user_metadata?.role as RoleType) ?? null

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 animate-pulse">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">Plate Pass</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Sticky Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-foreground">Plate Pass</span>
          </div>

          {user && role ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {ROLE_LABELS[role]}
              </span>
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : null}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {!user && <LandingView />}
        {user && role === "restaurant" && <RestaurantView />}
        {user && role === "user" && <UserView />}
        {user && role === "volunteer" && <VolunteerView />}
        {user && !role && <LandingView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Leaf className="h-3.5 w-3.5 text-primary" />
            <span>Plate Pass - Reducing food waste, one meal at a time.</span>
          </div>
          <span>Prototype - No real data or transactions</span>
        </div>
      </footer>
    </div>
  )
}
