"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Leaf, UtensilsCrossed, Users, Truck, ArrowRight, Heart, Recycle, ShieldCheck } from "lucide-react"
import { supabase } from "@/lib/supabase"

type RoleType = "restaurant" | "user" | "volunteer"

const ROLE_DISPLAY: Record<RoleType, string> = {
  restaurant: "a Plater",
  user: "an Eater",
  volunteer: "a Passer",
}

export function LandingView() {
  const [agreementDialog, setAgreementDialog] = useState<"restaurant" | "volunteer" | null>(null)
  const [agreed, setAgreed] = useState(false)

  const [authDialog, setAuthDialog] = useState(false)
  const [authRole, setAuthRole] = useState<RoleType | null>(null)
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState(false)

  function handleRoleClick(role: RoleType) {
    if (role === "user") {
      setAuthRole("user")
      setIsSignUp(true)
      setAuthDialog(true)
    } else {
      setAgreed(false)
      setAgreementDialog(role)
    }
  }

  function handleProceed() {
    if (agreed && agreementDialog) {
      setAuthRole(agreementDialog)
      setAgreementDialog(null)
      setAgreed(false)
      setIsSignUp(true)
      setAuthDialog(true)
    }
  }

  function resetAuthForm() {
    setEmail("")
    setPassword("")
    setAuthError("")
    setIsSignUp(true)
    setAuthRole(null)
    setAuthLoading(false)
    setConfirmEmail(false)
  }

  async function handleAuth() {
    if (!authRole || !email || !password) return
    setAuthError("")
    setAuthLoading(true)

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: authRole },
          },
        })
        if (error) {
          setAuthError(error.message)
          return
        }
        if (data.user && !data.session) {
          setConfirmEmail(true)
          return
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          setAuthError(error.message)
          return
        }
      }
      setAuthDialog(false)
      resetAuthForm()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred"
      setAuthError(message)
    } finally {
      setAuthLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 py-24 text-center lg:py-36">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="font-mono text-sm font-bold uppercase tracking-widest text-primary">
              Plate Pass
            </span>
          </div>
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Rescue Food. Nourish Communities.
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Every day, restaurants discard tons of perfectly good food. Plate Pass bridges the gap
            between surplus and need, connecting Platers, Eaters, and Passers
            in one seamless platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="gap-2" onClick={() => handleRoleClick("user")}>
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => document.getElementById("roles")?.scrollIntoView({ behavior: "smooth" })}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-3 text-center md:text-left">
            <Heart className="h-6 w-6 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">12,400+</p>
              <p className="text-sm text-muted-foreground">Meals Donated</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-center md:text-left">
            <Recycle className="h-6 w-6 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">8,200 lbs</p>
              <p className="text-sm text-muted-foreground">Food Waste Saved</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-center md:text-left">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">340+</p>
              <p className="text-sm text-muted-foreground">Active Passers</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-center md:text-left">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">85</p>
              <p className="text-sm text-muted-foreground">Partner Platers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section id="roles" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-3xl font-bold text-foreground">Join as</h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
            Choose your role and start making a difference today. Everyone has a part to play in reducing food waste.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Restaurant Card */}
            <Card
              className="group cursor-pointer border-2 border-transparent transition-all hover:border-primary hover:shadow-lg"
              onClick={() => handleRoleClick("restaurant")}
            >
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <UtensilsCrossed className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Plater</CardTitle>
                <CardDescription>Donate surplus food and reduce waste from your kitchen.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 flex flex-col gap-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    AI-powered food analysis
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    Track your impact metrics
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    Easy donation scheduling
                  </li>
                </ul>
                <Button className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground" variant="outline">
                  Join as Plater <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* User Card */}
            <Card
              className="group cursor-pointer border-2 border-transparent transition-all hover:border-accent hover:shadow-lg"
              onClick={() => handleRoleClick("user")}
            >
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Eater</CardTitle>
                <CardDescription>Browse available food near you and place orders for free meals.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 flex flex-col gap-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    Filter by cuisine & allergens
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    Pickup or delivery options
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    Real-time availability
                  </li>
                </ul>
                <Button className="w-full gap-2" variant="outline">
                  Join as Eater <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Volunteer Card */}
            <Card
              className="group cursor-pointer border-2 border-transparent transition-all hover:border-primary hover:shadow-lg"
              onClick={() => handleRoleClick("volunteer")}
            >
              <CardHeader className="pb-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Passer</CardTitle>
                <CardDescription>Drive surplus food to those in need and climb the leaderboard.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 flex flex-col gap-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    AI-optimized delivery routes
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    Social leaderboard
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    Flexible scheduling
                  </li>
                </ul>
                <Button className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground" variant="outline">
                  Join as Passer <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Agreement Dialog */}
      <Dialog open={!!agreementDialog} onOpenChange={(open) => { if (!open) setAgreementDialog(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Food Safety & Liability Agreement</DialogTitle>
            <DialogDescription>
              Please review and accept the following terms before proceeding as a {agreementDialog === "restaurant" ? "Plater" : "Passer"}.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground">
            <p className="mb-3">
              By joining Plate Pass as a {agreementDialog === "restaurant" ? "Plater" : "Passer"}, you agree to:
            </p>
            <ul className="flex flex-col gap-2">
              <li>1. Comply with all local food safety and handling regulations.</li>
              <li>2. Ensure donated food is fit for human consumption and properly stored.</li>
              <li>3. Hold Plate Pass harmless from any liability arising from food-related illness.</li>
              <li>4. Follow all platform guidelines for {agreementDialog === "restaurant" ? "food preparation and packaging" : "safe food transportation and delivery as a Passer"}.</li>
            </ul>
          </div>
          <div className="flex items-start gap-3 pt-2">
            <Checkbox
              id="agreement"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
            />
            <label htmlFor="agreement" className="text-sm leading-relaxed text-foreground cursor-pointer">
              I have read and agree to the Food Safety & Liability Agreement.
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAgreementDialog(null)}>Cancel</Button>
            <Button disabled={!agreed} onClick={handleProceed}>
              Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auth Dialog */}
      <Dialog open={authDialog} onOpenChange={(open) => { if (!open) { setAuthDialog(false); resetAuthForm() } }}>
        <DialogContent className="sm:max-w-md">
          {confirmEmail ? (
            <>
              <DialogHeader>
                <DialogTitle>Check Your Email</DialogTitle>
                <DialogDescription>
                  We sent a confirmation link to <strong>{email}</strong>. Please confirm your email, then sign in below.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex-col gap-3 sm:flex-col">
                <Button
                  className="w-full"
                  onClick={() => {
                    setConfirmEmail(false)
                    setIsSignUp(false)
                    setPassword("")
                    setAuthError("")
                  }}
                >
                  Sign In
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{isSignUp ? "Create Your Account" : "Welcome Back"}</DialogTitle>
                <DialogDescription>
                  {isSignUp
                    ? `Sign up to join Plate Pass as ${authRole ? ROLE_DISPLAY[authRole] : "a member"}.`
                    : "Sign in to your existing Plate Pass account."}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="auth-email">Email</Label>
                  <Input
                    id="auth-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setAuthError("") }}
                    onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="auth-password">Password</Label>
                  <Input
                    id="auth-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setAuthError("") }}
                    onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                  />
                </div>
                {authError && (
                  <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {authError}
                  </p>
                )}
              </div>
              <DialogFooter className="flex-col gap-3 sm:flex-col">
                <Button
                  className="w-full"
                  disabled={authLoading || !email || !password}
                  onClick={handleAuth}
                >
                  {authLoading ? "Please wait\u2026" : isSignUp ? "Sign Up" : "Sign In"}
                </Button>
                <button
                  type="button"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => { setIsSignUp(!isSignUp); setAuthError("") }}
                >
                  {isSignUp ? "Already have an account? Sign in" : "Don\u2019t have an account? Sign up"}
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
