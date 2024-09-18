import React from "react";
import Link from "next/link";
import { Star, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number | null | undefined;
  cuisine: string;
  location: {
    locality: string;
  };
  phone: string | null | undefined;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link
      href={`/restaurant/${restaurant.id}`}
      passHref
      className="block w-full max-w-2xl mx-auto"
    >
      <Card className="group bg-zinc-900 text-amber-100 border-amber-800 hover:border-amber-700 transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/30 overflow-hidden">
        <div className="relative overflow-hidden">
          <Image
            width={500}
            height={500}
            src={restaurant.image || "/placeholder.svg?height=300&width=600"}
            alt={restaurant.name}
            className="w-full h-72 sm:h-80 object-cover transition-transform duration-300 group-hover:scale-110 filter sepia brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-70"></div>
          <Badge className="absolute top-4 right-4 bg-amber-700 text-amber-100 border-amber-600 text-lg py-1 px-3">
            {restaurant.cuisine}
          </Badge>
        </div>
        <CardContent className="p-6 bg-[url('/noise.png')] bg-repeat">
          <h3 className="text-3xl font-bold mb-4 text-amber-200 font-serif tracking-wide">
            {restaurant.name}
          </h3>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < (restaurant.rating ?? 0)
                    ? "text-amber-400"
                    : "text-zinc-700"
                }`}
                fill={i < (restaurant.rating ?? 0) ? "currentColor" : "none"}
              />
            ))}
            <span className="ml-3 text-xl text-amber-300 font-mono">
              {restaurant.rating?.toFixed(1) || "N/A"}
            </span>
          </div>
        </CardContent>
        <CardFooter className="px-6 py-4 bg-zinc-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-amber-800/30">
          <div className="flex items-center text-amber-400">
            <MapPin className="w-5 h-5 mr-3" />
            <span className="text-lg font-mono">
              {restaurant.location.locality || "Unknown Location"}
            </span>
          </div>
          <div className="flex items-center text-amber-400">
            <Phone className="w-5 h-5 mr-3" />
            <span className="text-lg font-mono">{restaurant.phone || "N/A"}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}