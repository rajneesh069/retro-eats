"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { LocationPopup } from "@/components/LocationPopup";
import { useRouter } from "next/navigation";
import { SERVER_URL } from "@/utils/config";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge, DollarSign, MapPin, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number | null | undefined;
  cuisine: string;
  location: {
    locality: string;
    country: {
      countryName: string;
    };
  };
  phone: string | null | undefined;
  averageCostForTwo: number;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  const formattedRating =
    typeof restaurant.rating === "number"
      ? restaurant.rating.toFixed(1)
      : "N/A";
  const formattedCost = restaurant.averageCostForTwo.toLocaleString();

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
      <div className="relative">
        <Image
          width={500}
          height={300}
          src={restaurant.image || "/placeholder.svg?height=300&width=500"}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-yellow-400 text-yellow-900">
          {formattedRating} <Star className="w-4 h-4 ml-1 inline" />
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="text-2xl font-bold text-primary mb-2">
          {restaurant.name}
        </h3>
        <p className="text-muted-foreground mb-2 font-medium">
          {restaurant.cuisine}
        </p>
        <div className="flex items-center text-muted-foreground mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="mr-2">
            {restaurant.location.locality || "Unknown Location"}
          </span>
          <span>
            {restaurant.location.country.countryName || "Unknown Country"}
          </span>
        </div>
        <div className="flex items-center text-muted-foreground mb-2">
          <DollarSign className="w-4 h-4 mr-1" />
          <span>Average Cost for Two: ${formattedCost}</span>
        </div>
        {restaurant.phone && (
          <div className="flex items-center text-muted-foreground">
            <Phone className="w-4 h-4 mr-1" />
            <span>{restaurant.phone}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleCardClick} className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

const LocationSearch: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const fetchRestaurants = async (
    lat: number,
    lon: number,
    pageNumber: number
  ) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      console.log(`Fetching data for page ${pageNumber}...`);
      const response = await axios.get(
        `${SERVER_URL}/api/v1/restaurant/location`,
        {
          params: { latitude: lat, longitude: lon, page: pageNumber },
        }
      );

      const fetchedRestaurants = response.data.data.map(
        (restaurant: {
          restaurant_id: string;
          name: string;
          thumbImage: string;
          averageCostForTwo: string;
          aggregateRating: string;
          cuisines: string[];
          location: { country: { countryName: string }; locality: string };
        }) => ({
          id: restaurant.restaurant_id,
          name: restaurant.name,
          image: restaurant.thumbImage || "default-image-url.jpg",
          rating: restaurant.aggregateRating || 0,
          cuisine: restaurant.cuisines || "Unknown",
          location: {
            locality: restaurant.location?.locality || "Unknown Location",
            country: {
              countryName:
                restaurant.location?.country?.countryName || "Unknown Country",
            },
          },
          phone: "", // Update this if phone data is available
          averageCostForTwo: restaurant.averageCostForTwo || 0,
        })
      );

      setRestaurants((prev) => [...prev, ...fetchedRestaurants]);

      const nextPage = response.data.pagination.nextPage;
      setHasMore(nextPage !== null);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (lat: number, lon: number) => {
    setLatitude(lat);
    setLongitude(lon);
    setPage(1);
    setRestaurants([]);
    setHasMore(true);
  };

  useEffect(() => {
    if (latitude !== null && longitude !== null && page > 0) {
      fetchRestaurants(latitude, longitude, page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      const handleScroll = () => {
        const scrollPosition =
          window.innerHeight + document.documentElement.scrollTop;
        const pageHeight = document.documentElement.scrollHeight;
        const triggerPosition = pageHeight * 0.8;

        if (scrollPosition >= triggerPosition) {
          if (hasMore && !loading) {
            setPage((prev) => prev + 1);
          }
        }
      };

      window.addEventListener("scroll", handleScroll);

      handleScroll();

      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [hasMore, loading, latitude, longitude]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-100 py-8">
        <LocationPopup onLocationSelect={handleLocationSelect} />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Restaurants Near Your Location
        </h1>
        {loading && <p className="text-center text-black">Loading...</p>}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
          {!hasMore && (
            <p className="text-center mt-4">No more restaurants to load.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default LocationSearch;
