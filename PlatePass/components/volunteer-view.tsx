"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Truck,
  Trophy,
  UserPlus,
  Sparkles,
  Navigation,
  MapPin,
  Clock,
  ArrowRight,
  Route,
} from "lucide-react"

const LEADERBOARD = [
  { rank: 1, name: "You", deliveries: 47, initials: "YO" },
  { rank: 2, name: "Sarah M.", deliveries: 42, initials: "SM" },
  { rank: 3, name: "David K.", deliveries: 38, initials: "DK" },
  { rank: 4, name: "Mia R.", deliveries: 31, initials: "MR" },
  { rank: 5, name: "James L.", deliveries: 27, initials: "JL" },
]

const AI_ROUTES = [
  {
    id: 1,
    title: "Downtown Loop",
    stops: 3,
    distance: "4.2 mi",
    time: "~35 min",
    restaurants: ["Green Leaf Kitchen", "Bella Italia", "The Daily Bread"],
  },
  {
    id: 2,
    title: "East Side Express",
    stops: 2,
    distance: "3.1 mi",
    time: "~20 min",
    restaurants: ["Spice Route", "Sakura Sushi"],
  },
  {
    id: 3,
    title: "Campus Circuit",
    stops: 4,
    distance: "5.8 mi",
    time: "~45 min",
    restaurants: ["Taco Fiesta", "Green Leaf Kitchen", "The Daily Bread", "Spice Route"],
  },
]

interface Delivery {
  id: number
  restaurant: string
  dish: string
  distance: string
  dropOff: string
  timeWindow: string
  servings: number
}

const MOCK_DELIVERIES: Delivery[] = [
  { id: 1, restaurant: "Green Leaf Kitchen", dish: "Vegetable Stir Fry", distance: "1.2 mi", dropOff: "Community Center, 100 Oak Ave", timeWindow: "2:00 - 3:00 PM", servings: 12 },
  { id: 2, restaurant: "Bella Italia", dish: "Pasta Primavera", distance: "2.4 mi", dropOff: "Shelter, 200 Elm St", timeWindow: "3:00 - 4:30 PM", servings: 8 },
  { id: 3, restaurant: "The Daily Bread", dish: "Sourdough & Soup", distance: "0.8 mi", dropOff: "Food Bank, 300 Maple Rd", timeWindow: "1:00 - 2:00 PM", servings: 20 },
  { id: 4, restaurant: "Spice Route", dish: "Chickpea Curry", distance: "3.5 mi", dropOff: "Church Hall, 400 Pine Blvd", timeWindow: "4:00 - 5:30 PM", servings: 15 },
  { id: 5, restaurant: "Taco Fiesta", dish: "Bean Burritos", distance: "1.8 mi", dropOff: "Youth Center, 500 Cedar Ln", timeWindow: "12:00 - 1:30 PM", servings: 10 },
]

export function VolunteerView() {
  const [sortBy, setSortBy] = useState("time")
  const [addFriendOpen, setAddFriendOpen] = useState(false)
  const [accepted, setAccepted] = useState<number[]>([])

  const sorted = [...MOCK_DELIVERIES].sort((a, b) => {
    if (sortBy === "distance") return parseFloat(a.distance) - parseFloat(b.distance)
    return a.timeWindow.localeCompare(b.timeWindow)
  })

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Top Stats & AI Recommendations */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        {/* Total Deliveries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-foreground">47</p>
            <p className="mt-1 text-xs text-muted-foreground">+5 this week</p>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="border-primary/30 bg-primary/5 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Recommended Routes
            </CardTitle>
            <CardDescription>Optimized based on your location and delivery history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {AI_ROUTES.map((route) => (
                <div
                  key={route.id}
                  className="rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-sm"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Route className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{route.title}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <span>{route.stops} stops</span>
                    <span>{route.distance} total</span>
                    <span>{route.time}</span>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-full gap-1 text-xs">
                    Start Route <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Leaderboard */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="h-4 w-4 text-accent" />
                Friends Leaderboard
              </CardTitle>
              <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => setAddFriendOpen(true)}>
                <UserPlus className="h-3 w-3" /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {LEADERBOARD.map((person) => (
                <div
                  key={person.rank}
                  className={`flex items-center gap-3 rounded-lg p-2.5 ${
                    person.name === "You"
                      ? "border border-primary/30 bg-primary/5"
                      : "bg-muted/30"
                  }`}
                >
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    person.rank === 1
                      ? "bg-primary text-primary-foreground"
                      : person.rank === 2
                      ? "bg-accent/20 text-accent"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {person.rank}
                  </span>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={`text-xs ${person.name === "You" ? "bg-primary/10 text-primary" : ""}`}>
                      {person.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {person.name}
                      {person.name === "You" && (
                        <Badge variant="secondary" className="ml-2 text-[10px]">You</Badge>
                      )}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-foreground">{person.deliveries}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base">Available Deliveries</CardTitle>
                <CardDescription className="mt-1">{sorted.length} deliveries waiting</CardDescription>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">Sort by Time</SelectItem>
                  <SelectItem value="distance">Sort by Distance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {sorted.map((delivery) => {
                const isAccepted = accepted.includes(delivery.id)
                return (
                  <div
                    key={delivery.id}
                    className={`rounded-lg border p-4 transition-all ${
                      isAccepted
                        ? "border-primary/40 bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-semibold text-foreground">{delivery.dish}</span>
                          <Badge variant="outline" className="text-xs">{delivery.servings} servings</Badge>
                        </div>
                        <p className="mb-2 text-sm text-muted-foreground">{delivery.restaurant}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Navigation className="h-3 w-3 text-primary" /> {delivery.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-primary" /> {delivery.timeWindow}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-primary" /> {delivery.dropOff}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={isAccepted ? "secondary" : "default"}
                        className="shrink-0 gap-1"
                        disabled={isAccepted}
                        onClick={() => setAccepted([...accepted, delivery.id])}
                      >
                        {isAccepted ? "Accepted" : "Accept Delivery"}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Friend Dialog */}
      <Dialog open={addFriendOpen} onOpenChange={setAddFriendOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add a Friend</DialogTitle>
            <DialogDescription>Enter your friend&apos;s username or email to add them to your leaderboard.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-2">
            <Label htmlFor="friend-email">Username or Email</Label>
            <Input id="friend-email" placeholder="friend@example.com" />
          </div>
          <Separator />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddFriendOpen(false)}>Cancel</Button>
            <Button onClick={() => setAddFriendOpen(false)}>Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
