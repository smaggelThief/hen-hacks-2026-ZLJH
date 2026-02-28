"use client"

import { useState } from "react"
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
} from "lucide-react"

const MOCK_HISTORY = [
  { id: 1, date: "2026-02-27", dish: "Margherita Pizza", servings: 15, status: "Completed", location: "Downtown Kitchen" },
  { id: 2, date: "2026-02-26", dish: "Chicken Stir Fry", servings: 20, status: "Completed", location: "Main Street Bistro" },
  { id: 3, date: "2026-02-25", dish: "Caesar Salad", servings: 30, status: "Completed", location: "Downtown Kitchen" },
  { id: 4, date: "2026-02-24", dish: "Tomato Soup", servings: 25, status: "Completed", location: "Harbor View" },
  { id: 5, date: "2026-02-23", dish: "Pasta Primavera", servings: 12, status: "Completed", location: "Main Street Bistro" },
]

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

  function handleImageUpload() {
    setShowAIResult(true)
    setEditing(false)
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
            <p className="text-3xl font-bold text-foreground">1,240 lbs</p>
            <p className="mt-1 text-xs text-muted-foreground">+180 lbs from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Meals Donated</CardTitle>
            <Heart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">3,420</p>
            <p className="mt-1 text-xs text-muted-foreground">+312 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">3</p>
            <p className="mt-1 text-xs text-muted-foreground">2 scheduled for today</p>
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
                <Input id="time-start" type="time" defaultValue="14:00" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="time-end">Time End</Label>
                <Input id="time-end" type="time" defaultValue="16:00" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="location">Pickup Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="location" className="pl-10" placeholder="123 Main Street, Suite 4" defaultValue="742 Evergreen Terrace, Springfield" />
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

            <Button className="w-full gap-2 sm:w-auto sm:self-end">
              <Plus className="h-4 w-4" /> Create Event
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
                {MOCK_HISTORY.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.date}</TableCell>
                    <TableCell className="font-medium">{item.dish}</TableCell>
                    <TableCell>{item.servings}</TableCell>
                    <TableCell className="text-muted-foreground">{item.location}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
