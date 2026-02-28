"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Clock,
  UtensilsCrossed,
  Filter,
  Users,
  Truck,
  Loader2,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Donation {
  id: string
  restaurant_id: string
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

function formatTimeWindow(start: string | null, end: string | null): string {
  if (!start || !end) return "Flexible"
  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  return `${fmt(start)} \u2013 ${fmt(end)}`
}

function parseAllergens(raw: string | null): string[] {
  if (!raw) return []
  return raw.split(",").map((s) => s.trim()).filter(Boolean)
}

export function UserView() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<Donation | null>(null)
  const [isDelivery, setIsDelivery] = useState(false)
  const [people, setPeople] = useState("1")
  const [confirming, setConfirming] = useState(false)
  const [cuisineFilter, setCuisineFilter] = useState("all")
  const [allergenFilter, setAllergenFilter] = useState("all")
  const [distanceFilter, setDistanceFilter] = useState("all")

  const fetchAvailable = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false })

      if (!error && data) setDonations(data)
    } catch {
      // table may not exist yet
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAvailable()
  }, [fetchAvailable])

  const filtered = donations.filter((item) => {
    if (cuisineFilter !== "all" && item.cuisine !== cuisineFilter) return false
    if (allergenFilter !== "all" && parseAllergens(item.allergens).includes(allergenFilter)) return false
    return true
  })

  async function handleConfirmOrder() {
    if (!selectedItem) return
    setConfirming(true)
    try {
      const newStatus = isDelivery ? "pending_delivery" : "claimed_pickup"
      const { error } = await supabase
        .from("donations")
        .update({ status: newStatus })
        .eq("id", selectedItem.id)

      if (error) throw error

      setSelectedItem(null)
      await fetchAvailable()
    } catch (err) {
      console.error("Failed to confirm order:", err)
    } finally {
      setConfirming(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Filter className="h-4 w-4 text-primary" />
              Filters
            </div>
            <div className="flex flex-1 flex-col gap-4 sm:flex-row">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Cuisine</Label>
                <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cuisines</SelectItem>
                    <SelectItem value="Asian">Asian</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                    <SelectItem value="American">American</SelectItem>
                    <SelectItem value="Indian">Indian</SelectItem>
                    <SelectItem value="Mexican">Mexican</SelectItem>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Exclude Allergen</Label>
                <Select value={allergenFilter} onValueChange={setAllergenFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">No Filter</SelectItem>
                    <SelectItem value="Gluten">Gluten</SelectItem>
                    <SelectItem value="Dairy">Dairy</SelectItem>
                    <SelectItem value="Soy">Soy</SelectItem>
                    <SelectItem value="Fish">Fish</SelectItem>
                    <SelectItem value="Sesame">Sesame</SelectItem>
                    <SelectItem value="Eggs">Eggs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Max Distance</Label>
                <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Distance</SelectItem>
                    <SelectItem value="1mi">Under 1 mile</SelectItem>
                    <SelectItem value="2mi">Under 2 miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading available meals…
            </span>
          ) : (
            <>
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> available meals near you
            </>
          )}
        </p>
      </div>

      {/* Food Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const allergens = parseAllergens(item.allergens)
          return (
            <Card
              key={item.id}
              className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
              onClick={() => { setSelectedItem(item); setIsDelivery(false); setPeople("1") }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{item.dish_name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <UtensilsCrossed className="h-3 w-3" />
                      {item.location}
                    </CardDescription>
                  </div>
                  {item.cuisine && (
                    <Badge variant="secondary" className="shrink-0">{item.cuisine}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {formatTimeWindow(item.pickup_start, item.pickup_end)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    {item.servings} servings available
                  </div>
                </div>
                {allergens.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {allergens.map((a) => (
                      <Badge key={a} variant="outline" className="text-xs">
                        {a}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <UtensilsCrossed className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-medium text-muted-foreground">No meals match your filters</p>
          <p className="text-sm text-muted-foreground/70">Try adjusting the filters above to see more results.</p>
        </div>
      )}

      {/* Order Sheet */}
      <Sheet open={!!selectedItem} onOpenChange={(open) => { if (!open) setSelectedItem(null) }}>
        <SheetContent className="overflow-y-auto">
          {selectedItem && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedItem.dish_name}</SheetTitle>
                <SheetDescription>{selectedItem.location}</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-6 py-6">
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    {formatTimeWindow(selectedItem.pickup_start, selectedItem.pickup_end)}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    {selectedItem.servings} servings available
                  </div>
                  {parseAllergens(selectedItem.allergens).length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {parseAllergens(selectedItem.allergens).map((a) => (
                        <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex flex-col gap-4">
                  <h3 className="font-semibold text-foreground">Place Order</h3>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="people">Number of People</Label>
                    <Input
                      id="people"
                      type="number"
                      min={1}
                      max={selectedItem.servings}
                      value={people}
                      onChange={(e) => setPeople(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Max {selectedItem.servings} servings available
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                    <div className="flex items-center gap-2">
                      {isDelivery ? (
                        <Truck className="h-4 w-4 text-primary" />
                      ) : (
                        <MapPin className="h-4 w-4 text-primary" />
                      )}
                      <span className="text-sm font-medium text-foreground">
                        {isDelivery ? "Delivery" : "Pickup"}
                      </span>
                    </div>
                    <Switch checked={isDelivery} onCheckedChange={setIsDelivery} />
                  </div>

                  {isDelivery ? (
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Estimated delivery time:</span>
                        <span className="font-semibold text-foreground">25-35 min</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        A volunteer driver will deliver to your location. You will receive a notification when the driver is on the way.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">Pickup Address</span>
                        </div>
                        <p className="text-muted-foreground">{selectedItem.location}</p>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">Pickup Window</span>
                        </div>
                        <p className="text-muted-foreground">
                          {formatTimeWindow(selectedItem.pickup_start, selectedItem.pickup_end)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <SheetFooter>
                <Button
                  className="w-full"
                  size="lg"
                  disabled={confirming}
                  onClick={handleConfirmOrder}
                >
                  {confirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming…
                    </>
                  ) : (
                    <>Confirm Order for {people} {parseInt(people) === 1 ? "person" : "people"}</>
                  )}
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
