'use client'

import React, { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import { Star, MapPin, Phone } from "lucide-react"
import { SERVER_URL } from "@/utils/config"
import Image from "next/image"

interface Restaurant {
  id: number
  name: string
  image: string
  rating: number
  cuisine: string
  location: string
  phone: string
}

interface RestaurantCardProps {
  restaurant: Restaurant
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <div className="bg-yellow-100 rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl border-4 border-orange-500">
        <div className="relative">
          <Image
            width={500}
            height={300}
            src={restaurant.image || "/placeholder.svg?height=300&width=500"}
            alt={restaurant.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 rounded-bl-xl font-bold">
            {restaurant.rating.toFixed(1)}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-2xl font-bold text-orange-800 mb-2 font-serif">
            {restaurant.name}
          </h3>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < restaurant.rating ? "text-orange-500" : "text-gray-300"
                }`}
                fill={i < restaurant.rating ? "currentColor" : "none"}
              />
            ))}
          </div>
          <p className="text-orange-700 mb-2 font-medium italic">{restaurant.cuisine}</p>
          <div className="flex items-center text-orange-600 mb-2">
            <MapPin className="w-5 h-5 mr-2 text-orange-500" />
            <span>{restaurant.location}</span>
          </div>
          <div className="flex items-center text-orange-600">
            <Phone className="w-5 h-5 mr-2 text-orange-500" />
            <span>{restaurant.phone || "N/A"}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

const RestaurantListingPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [page, setPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)

  useEffect(() => {
    const fetchRestaurants = async (pageNumber: number) => {
      if (!loading && hasMore) {
        setLoading(true)
        try {
          const response = await axios.get(
            `${SERVER_URL}/api/v1/restaurant/list?page=${pageNumber}`
          )
          const fetchedRestaurants = response.data.data.map(
            (restaurant: {
              restaurant_id: string
              name: string
              thumbImage: string
              aggregateRating: string
              cuisines: string[]
              location: { country: { countryName: string } }
            }) => ({
              id: restaurant.restaurant_id,
              name: restaurant.name,
              image: restaurant.thumbImage || "",
              rating: restaurant.aggregateRating,
              cuisine: restaurant.cuisines || "Unknown",
              location:
                restaurant.location?.country?.countryName || "Unknown Location",
              phone: "",
            })
          )

          if (fetchedRestaurants.length > 0) {
            setRestaurants((prevRestaurants) => [
              ...prevRestaurants,
              ...fetchedRestaurants,
            ])
          } else {
            setHasMore(false)
          }
        } catch (error) {
          console.error("Error fetching restaurants:", error)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchRestaurants(page)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        setPage((prevPage) => prevPage + 1)
      }
    }
    const debouncedHandleScroll = debounce(handleScroll, 200)
    window.addEventListener("scroll", debouncedHandleScroll)
    return () => window.removeEventListener("scroll", debouncedHandleScroll)
  }, [loading, hasMore])

  const debounce = (func: () => void, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>
    return () => {
      clearTimeout(timeout)
      timeout = setTimeout(func, wait)
    }
  }

  return (
    <div className="bg-orange-50 py-8 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-extrabold text-orange-800 mb-8 text-center font-serif">
          Retro Eats
        </h1>
        <div className="w-24 h-2 bg-orange-500 mx-auto mb-12"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>

        {loading && (
          <div className="text-center mt-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            <p className="mt-2 text-orange-800 font-medium">Loading more delicious options...</p>
          </div>
        )}

        {!hasMore && (
          <div className="text-center mt-8">
            <p className="text-orange-800 font-medium">You&apos;ve seen all our tasty picks!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantListingPage