"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Leaf, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LandingView } from "@/components/landing-view"
import { RestaurantView } from "@/components/restaurant-view"
import { UserView } from "@/components/user-view"
import { VolunteerView } from "@/components/volunteer-view"

type ViewType = "landing" | "restaurant" | "user" | "volunteer"

const VIEW_LABELS: Record<ViewType, string> = {
  landing: "Landing",
  restaurant: "Restaurant UI",
  user: "User UI",
  volunteer: "Volunteer UI",
}

export default function Page() {
  const [view, setView] = useState<ViewType>("landing")

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Sticky Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <button
            onClick={() => setView("landing")}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Leaf className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-foreground">Plate Pass</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {(Object.keys(VIEW_LABELS) as ViewType[]).map((key) => (
              <Button
                key={key}
                variant={view === key ? "default" : "ghost"}
                size="sm"
                onClick={() => setView(key)}
                className="text-sm"
              >
                {VIEW_LABELS[key]}
              </Button>
            ))}
          </nav>

          {/* Mobile Dropdown */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  {VIEW_LABELS[view]}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(Object.keys(VIEW_LABELS) as ViewType[]).map((key) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setView(key)}
                    className={view === key ? "font-semibold" : ""}
                  >
                    {VIEW_LABELS[key]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {view === "landing" && <LandingView onNavigate={setView} />}
        {view === "restaurant" && <RestaurantView />}
        {view === "user" && <UserView />}
        {view === "volunteer" && <VolunteerView />}
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
