"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { Star } from "lucide-react"
import { SERVER_URL } from "@/utils/config"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Location {
  latitude: number
  longitude: number
  address: string
  city: string
  country: string
}

interface RestaurantData {
  restaurant_id: number
  name: string
  cuisines: string
  featuredImage: string
  ratingText: string
  aggregateRating: number
  votes: number
  averageCostForTwo: number
  hasTableBooking: boolean
  hasOnlineDelivery: boolean
  isDeliveringNow: boolean
  location: Location
}

export default function RestaurantDetailPage() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (id) fetchRestaurantData(id as string)
    else setError(true)
  }, [id])

  const fetchRestaurantData = async (restaurantId: string) => {
    try {
      setLoading(true)
      const response = await axios.get(`${SERVER_URL}/api/v1/restaurant`, {
        params: { id: restaurantId },
      })
      setRestaurant(response.data.Restaurant)
    } catch (err) {
      console.error("Error fetching restaurant data:", err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-amber-300">
        Loading restaurant data...
      </div>
    )
  }

  if (error || !restaurant) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        Failed to load restaurant information.
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-amber-100">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gray-900">
        <Image
          width={500}
          height={500}
          src={restaurant.featuredImage || "/placeholder.svg?height=400&width=600"}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-extrabold text-amber-300 mb-4 text-center px-4">
            {restaurant.name}
          </h1>
          <Badge variant="secondary" className="text-lg bg-amber-800 text-amber-100">
            {restaurant.cuisines}
          </Badge>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Restaurant Info */}
          <Card className="bg-gray-800 border-amber-700">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold text-amber-300">About the Restaurant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-amber-200">Cuisines</h3>
                <p className="text-amber-100">{restaurant.cuisines}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-amber-200">Rating</h3>
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(restaurant.aggregateRating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="text-amber-100">
                    {restaurant.aggregateRating.toFixed(1)} ({restaurant.votes} votes)
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-amber-200">Average Cost for Two</h3>
                <p className="text-amber-100">${restaurant.averageCostForTwo}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-amber-200">Location</h3>
                <p className="text-amber-100">
                  {restaurant.location.address}, {restaurant.location.city}, {restaurant.location.country}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-amber-200">Features</h3>
                <ul className="space-y-1 text-amber-100">
                  <li>
                    Table Booking: {restaurant.hasTableBooking ? "Available" : "Not Available"}
                  </li>
                  <li>
                    Online Delivery: {restaurant.hasOnlineDelivery ? "Available" : "Not Available"}
                  </li>
                  <li>
                    Currently Delivering: {restaurant.isDeliveringNow ? "Yes" : "No"}
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Google Map */}
          <Card className="bg-gray-800 border-amber-700">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold text-amber-300">Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border-4 border-amber-700">
                <iframe
                  className="w-full h-80"
                  src={`https://maps.google.com/maps?q=${restaurant.location.latitude},${restaurant.location.longitude}&z=15&output=embed`}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Now Button */}
        <div className="text-center mt-12">
          <Button className="px-10 py-6 bg-amber-600 hover:bg-amber-700 text-gray-900 text-xl font-bold rounded-full shadow-lg shadow-amber-900/50 transition-all hover:scale-105">
            Order Now
          </Button>
        </div>
      </main>
    </div>
  )
}