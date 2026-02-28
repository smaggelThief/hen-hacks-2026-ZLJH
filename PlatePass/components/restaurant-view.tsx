"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Weight,
  Heart,
  Upload,
  Sparkles,
  Pencil,
  Clock,
  MapPin,
  CalendarDays,
  Plus,
  Loader2,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Donation {
  id: string
  dish_name: string
  servings: number
  allergens: string | null
  cuisine: string | null
  location: string
  status: string
  pickup_start: string | null
  pickup_end: string | null
  created_at: string
}

export function RestaurantView() {
  const [showAIResult, setShowAIResult] = useState(false)
  const [editing, setEditing] = useState(false)
  const [aiData, setAiData] = useState({
    dish: "Pasta Carbonara",
    servings: "10",
    allergens: "Gluten, Dairy, Eggs",
    cuisine: "Italian",
    weight: "8 lbs",
  })

  // Controlled form inputs
  const [timeStart, setTimeStart] = useState("14:00")
  const [timeEnd, setTimeEnd] = useState("16:00")
  const [location, setLocation] = useState("742 Evergreen Terrace, Springfield")

  // Donation data from Supabase
  const [donations, setDonations] = useState<Donation[]>([])
  const [loadingDonations, setLoadingDonations] = useState(true)
  const [creating, setCreating] = useState(false)

  const fetchDonations = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .eq("restaurant_id", user.id)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setDonations(data)
      }
    } catch {
      // Table may not exist yet — show empty state
    } finally {
      setLoadingDonations(false)
    }
  }, [])

  useEffect(() => {
    fetchDonations()
  }, [fetchDonations])

  // Computed stats
  const totalServings = donations.reduce((sum, d) => sum + d.servings, 0)
  const activeEvents = donations.filter((d) => d.status === "available").length

  function handleImageUpload() {
    setShowAIResult(true)
    setEditing(false)
  }

  async function handleCreateEvent() {
    setCreating(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today = new Date().toISOString().split("T")[0]

      const { error } = await supabase.from("donations").insert({
        restaurant_id: user.id,
        dish_name: aiData.dish,
        servings: parseInt(aiData.servings) || 0,
        allergens: aiData.allergens || null,
        cuisine: aiData.cuisine || null,
        location,
        pickup_start: `${today}T${timeStart}:00`,
        pickup_end: `${today}T${timeEnd}:00`,
      })

      if (error) throw error

      await fetchDonations()

      // Reset the AI analysis panel after successful creation
      setShowAIResult(false)
      setAiData({ dish: "", servings: "", allergens: "", cuisine: "", weight: "" })
    } catch (err) {
      console.error("Failed to create donation:", err)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Top Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Waste Saved</CardTitle>
            <Weight className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {totalServings > 0 ? `${Math.round(totalServings * 0.75).toLocaleString()} lbs` : "0 lbs"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Estimated from servings donated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Meals Donated</CardTitle>
            <Heart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{totalServings.toLocaleString()}</p>
            <p className="mt-1 text-xs text-muted-foreground">Across {donations.length} donation{donations.length !== 1 ? "s" : ""}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{activeEvents}</p>
            <p className="mt-1 text-xs text-muted-foreground">Currently available for pickup</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Pickup Time</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">22 min</p>
            <p className="mt-1 text-xs text-muted-foreground">-4 min from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Create Donation Form */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Create Donation Event
            </CardTitle>
            <CardDescription>Fill in the details and upload an image to auto-analyze the food.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="time-start">Time Start</Label>
                <Input
                  id="time-start"
                  type="time"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="time-end">Time End</Label>
                <Input
                  id="time-end"
                  type="time"
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="location">Pickup Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="location"
                  className="pl-10"
                  placeholder="123 Main Street, Suite 4"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <Label>Food Image</Label>
              <button
                onClick={handleImageUpload}
                className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary hover:bg-muted/60"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload an image</span>
                <span className="text-xs text-muted-foreground/70">PNG, JPG up to 5MB</span>
              </button>
            </div>

            {/* AI Analysis Result */}
            {showAIResult && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">AI Analysis Result</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => setEditing(!editing)}>
                    <Pencil className="h-3 w-3" /> {editing ? "Done" : "Edit"}
                  </Button>
                </div>
                {editing ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs">Dish</Label>
                      <Input value={aiData.dish} onChange={(e) => setAiData({ ...aiData, dish: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs">Est. Servings</Label>
                      <Input value={aiData.servings} onChange={(e) => setAiData({ ...aiData, servings: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs">Allergens</Label>
                      <Input value={aiData.allergens} onChange={(e) => setAiData({ ...aiData, allergens: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs">Cuisine</Label>
                      <Input value={aiData.cuisine} onChange={(e) => setAiData({ ...aiData, cuisine: e.target.value })} />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Dish:</span>
                      <span className="font-medium text-foreground">{aiData.dish}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Est. Servings:</span>
                      <span className="font-medium text-foreground">{aiData.servings}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Allergens:</span>
                      <span className="font-medium text-foreground">{aiData.allergens}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Cuisine:</span>
                      <span className="font-medium text-foreground">{aiData.cuisine}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              className="w-full gap-2 sm:w-auto sm:self-end"
              disabled={creating || !aiData.dish}
              onClick={handleCreateEvent}
            >
              {creating ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</>
              ) : (
                <><Plus className="h-4 w-4" /> Create Event</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="mb-1 font-medium text-foreground">Best Practices</p>
              <p>Photograph food in good lighting for more accurate AI analysis. Include a clear view of all items.</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="mb-1 font-medium text-foreground">Scheduling</p>
              <p>Set pickup windows at least 1 hour wide to give volunteers flexibility.</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="mb-1 font-medium text-foreground">Packaging</p>
              <p>Use sealed, food-safe containers. Label any allergens clearly on the packaging.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donation History */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
          <CardDescription>Your recent food donation events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Dish</TableHead>
                  <TableHead>Servings</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingDonations ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading donations…
                      </div>
                    </TableCell>
                  </TableRow>
                ) : donations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No donations yet. Create your first event above!
                    </TableCell>
                  </TableRow>
                ) : (
                  donations.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs">
                        {new Date(item.created_at).toLocaleDateString("en-CA")}
                      </TableCell>
                      <TableCell className="font-medium">{item.dish_name}</TableCell>
                      <TableCell>{item.servings}</TableCell>
                      <TableCell className="text-muted-foreground">{item.location}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-primary/10 text-primary capitalize">
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
