"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Leaf, UtensilsCrossed, Users, Truck, ArrowRight, Heart, Recycle, ShieldCheck } from "lucide-react"

type ViewType = "landing" | "restaurant" | "user" | "volunteer"

interface LandingViewProps {
  onNavigate: (view: ViewType) => void
}

export function LandingView({ onNavigate }: LandingViewProps) {
  const [agreementDialog, setAgreementDialog] = useState<"restaurant" | "volunteer" | null>(null)
  const [agreed, setAgreed] = useState(false)

  function handleRoleClick(role: "restaurant" | "user" | "volunteer") {
    if (role === "user") {
      onNavigate("user")
    } else {
      setAgreed(false)
      setAgreementDialog(role)
    }
  }

  function handleProceed() {
    if (agreed && agreementDialog) {
      onNavigate(agreementDialog)
      setAgreementDialog(null)
      setAgreed(false)
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
            between surplus and need, connecting donors, recipients, and volunteer drivers
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
              <p className="text-sm text-muted-foreground">Active Volunteers</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-center md:text-left">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">85</p>
              <p className="text-sm text-muted-foreground">Partner Restaurants</p>
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
                <CardTitle className="text-xl">Restaurant</CardTitle>
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
                  Join as Restaurant <ArrowRight className="h-4 w-4" />
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
                <CardTitle className="text-xl">User</CardTitle>
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
                  Join as User <ArrowRight className="h-4 w-4" />
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
                <CardTitle className="text-xl">Volunteer</CardTitle>
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
                  Join as Volunteer <ArrowRight className="h-4 w-4" />
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
              Please review and accept the following terms before proceeding as a {agreementDialog === "restaurant" ? "Restaurant Partner" : "Volunteer Driver"}.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground">
            <p className="mb-3">
              By joining Plate Pass as a {agreementDialog === "restaurant" ? "Restaurant Partner" : "Volunteer Driver"}, you agree to:
            </p>
            <ul className="flex flex-col gap-2">
              <li>1. Comply with all local food safety and handling regulations.</li>
              <li>2. Ensure donated food is fit for human consumption and properly stored.</li>
              <li>3. Hold Plate Pass harmless from any liability arising from food-related illness.</li>
              <li>4. Follow all platform guidelines for {agreementDialog === "restaurant" ? "food preparation and packaging" : "safe food transportation and delivery"}.</li>
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
    </div>
  )
}
