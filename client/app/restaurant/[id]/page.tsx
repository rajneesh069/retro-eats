"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { StarIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SERVER_URL } from "@/utils/config";

interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
}

interface RestaurantData {
  restaurant_id: number;
  name: string;
  cuisines: string;
  featuredImage: string;
  ratingText: string;
  aggregateRating: number;
  votes: number;
  averageCostForTwo: number;
  hasTableBooking: boolean;
  hasOnlineDelivery: boolean;
  isDeliveringNow: boolean;
  location: Location;
}

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    //@ts-ignore
    if (id) fetchRestaurantData(id);
    else setError(true);
  }, [id]);

  const fetchRestaurantData = async (restaurantId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${SERVER_URL}/api/v1/restaurant`, {
        params: { id: restaurantId },
      });
      setRestaurant(response.data.Restaurant);
    } catch (err) {
      console.error("Error fetching restaurant data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl text-gray-600">Loading restaurant data...</div>;
  }

  if (error || !restaurant) {
    return <div className="flex justify-center items-center h-screen text-xl text-red-500">Failed to load restaurant information.</div>;
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Navbar isScrolled/>

      {/* Hero Section */}
      <section className="relative h-[400px] bg-gray-800">
        <img
          src={restaurant.featuredImage || "https://via.placeholder.com/600x400"}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-extrabold text-white">{restaurant.name}</h1>
          <p className="text-lg mt-4 text-gray-200">{restaurant.cuisines}</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Restaurant Info */}
          <div className="bg-white p-8 shadow-lg rounded-lg">
            <h2 className="text-3xl font-semibold mb-6">About the Restaurant</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Cuisines</h3>
                <p className="text-gray-600">{restaurant.cuisines}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Rating</h3>
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(restaurant.aggregateRating) ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-gray-600">
                    {restaurant.aggregateRating.toFixed(1)} ({restaurant.votes} votes)
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Average Cost for Two</h3>
                <p className="text-gray-600">${restaurant.averageCostForTwo}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Location</h3>
                <p className="text-gray-600">
                  {restaurant.location.address}, {restaurant.location.city}, {restaurant.location.country}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Features</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>Table Booking: {restaurant.hasTableBooking ? "Available" : "Not Available"}</li>
                  <li>Online Delivery: {restaurant.hasOnlineDelivery ? "Available" : "Not Available"}</li>
                  <li>Currently Delivering: {restaurant.isDeliveringNow ? "Yes" : "No"}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div className="bg-white p-8 shadow-lg rounded-lg">
            <h2 className="text-3xl font-semibold mb-6">Location</h2>
            <iframe
              className="w-full h-80 rounded-lg"
              src={`https://maps.google.com/maps?q=${restaurant.location.latitude},${restaurant.location.longitude}&z=15&output=embed`}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* Order Now Button */}
        <div className="text-center mt-12">
          <button className="px-10 py-4 bg-red-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-red-700 transition-colors">
            Order Now
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RestaurantDetailPage;
