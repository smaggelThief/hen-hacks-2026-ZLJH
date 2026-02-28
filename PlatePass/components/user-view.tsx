"use client"

import { useState } from "react"
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
  Navigation,
} from "lucide-react"

interface FoodItem {
  id: number
  restaurant: string
  dish: string
  cuisine: string
  distance: string
  servings: number
  timeWindow: string
  allergens: string[]
  address: string
}

const MOCK_FOOD: FoodItem[] = [
  { id: 1, restaurant: "Green Leaf Kitchen", dish: "Vegetable Stir Fry", cuisine: "Asian", distance: "0.5 mi", servings: 12, timeWindow: "2:00 - 4:00 PM", allergens: ["Soy", "Sesame"], address: "123 Oak Ave, Springfield" },
  { id: 2, restaurant: "Bella Italia", dish: "Pasta Primavera", cuisine: "Italian", distance: "1.2 mi", servings: 8, timeWindow: "3:00 - 5:00 PM", allergens: ["Gluten", "Dairy"], address: "456 Elm St, Springfield" },
  { id: 3, restaurant: "The Daily Bread", dish: "Sourdough & Soup", cuisine: "American", distance: "0.8 mi", servings: 20, timeWindow: "1:00 - 3:00 PM", allergens: ["Gluten"], address: "789 Maple Rd, Springfield" },
  { id: 4, restaurant: "Spice Route", dish: "Chickpea Curry", cuisine: "Indian", distance: "2.1 mi", servings: 15, timeWindow: "4:00 - 6:00 PM", allergens: [], address: "321 Pine Blvd, Springfield" },
  { id: 5, restaurant: "Taco Fiesta", dish: "Bean & Rice Burritos", cuisine: "Mexican", distance: "1.5 mi", servings: 10, timeWindow: "12:00 - 2:00 PM", allergens: ["Dairy"], address: "654 Cedar Ln, Springfield" },
  { id: 6, restaurant: "Sakura Sushi", dish: "Assorted Sushi Rolls", cuisine: "Japanese", distance: "3.0 mi", servings: 18, timeWindow: "5:00 - 7:00 PM", allergens: ["Soy", "Gluten", "Fish"], address: "987 Birch Way, Springfield" },
]

export function UserView() {
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null)
  const [isDelivery, setIsDelivery] = useState(false)
  const [people, setPeople] = useState("1")
  const [cuisineFilter, setCuisineFilter] = useState("all")
  const [allergenFilter, setAllergenFilter] = useState("all")
  const [distanceFilter, setDistanceFilter] = useState("all")

  const filtered = MOCK_FOOD.filter((item) => {
    if (cuisineFilter !== "all" && item.cuisine !== cuisineFilter) return false
    if (allergenFilter !== "all" && item.allergens.includes(allergenFilter)) return false
    if (distanceFilter === "1mi" && parseFloat(item.distance) > 1) return false
    if (distanceFilter === "2mi" && parseFloat(item.distance) > 2) return false
    return true
  })

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
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> available meals near you
        </p>
      </div>

      {/* Food Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
            onClick={() => { setSelectedItem(item); setIsDelivery(false); setPeople("1") }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{item.dish}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <UtensilsCrossed className="h-3 w-3" />
                    {item.restaurant}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="shrink-0">{item.cuisine}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Navigation className="h-3.5 w-3.5 text-primary" />
                  {item.distance} away
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  {item.timeWindow}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  {item.servings} servings available
                </div>
              </div>
              {item.allergens.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {item.allergens.map((a) => (
                    <Badge key={a} variant="outline" className="text-xs">
                      {a}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
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
                <SheetTitle>{selectedItem.dish}</SheetTitle>
                <SheetDescription>{selectedItem.restaurant}</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-6 py-6">
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Navigation className="h-4 w-4 text-primary" />
                    {selectedItem.distance} away
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    {selectedItem.timeWindow}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    {selectedItem.servings} servings available
                  </div>
                  {selectedItem.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.allergens.map((a) => (
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
                        <p className="text-muted-foreground">{selectedItem.address}</p>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">Pickup Window</span>
                        </div>
                        <p className="text-muted-foreground">{selectedItem.timeWindow}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <SheetFooter>
                <Button className="w-full" size="lg">
                  Confirm Order for {people} {parseInt(people) === 1 ? "person" : "people"}
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
