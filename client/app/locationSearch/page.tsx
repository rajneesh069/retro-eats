"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LocationPopup } from '@/components/LocationPopup';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar'; // Import Navbar
import Footer from '@/components/Footer'; // Import Footer
import { SERVER_URL } from '@/utils/config';

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

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const router = useRouter(); // useRouter to navigate

  const handleCardClick = () => {
    router.push(`/restaurant/${restaurant.id}`); // Navigate to /restaurant/{id}
  };

  const formattedRating = typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : 'N/A';
  const formattedCost = restaurant.averageCostForTwo.toLocaleString();

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl overflow-hidden cursor-pointer"
    >
      <img
        src={restaurant.image || 'default-image-url.jpg'}
        alt={restaurant.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{restaurant.name}</h3>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`inline-block w-5 h-5 ${i < (restaurant.rating ?? 0) ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </span>
          ))}
          <span className="ml-2 text-gray-700 text-lg">{formattedRating}</span>
        </div>
        <p className="text-gray-600 mb-2 font-medium">{restaurant.cuisine}</p>
        <div className="flex items-center text-gray-500 mb-2">
          <span className="mr-2">{restaurant.location.locality || 'Unknown Location'}</span>
          <span>{restaurant.location.country.countryName || 'Unknown Country'}</span>
        </div>
        <p className="text-gray-600 mb-2 font-medium">Average Cost for Two: ${formattedCost}</p>
        <div className="flex items-center text-gray-500">
          <span>{restaurant.phone || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

const LocationSearch: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const fetchRestaurants = async (lat: number, lon: number, pageNumber: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      console.log(`Fetching data for page ${pageNumber}...`);
      const response = await axios.get(`${SERVER_URL}/api/v1/restaurant/location`, {
        params: { latitude: lat, longitude: lon, page: pageNumber },
      });

      const fetchedRestaurants = response.data.data.map((restaurant:{restaurant_id:string, name:string, thumbImage:string,averageCostForTwo:string,aggregateRating:string,cuisines:string[], location : {country : {countryName:string}, locality:string}}) => ({
        id: restaurant.restaurant_id,
        name: restaurant.name,
        image: restaurant.thumbImage || 'default-image-url.jpg',
        rating: restaurant.aggregateRating || 0,
        cuisine: restaurant.cuisines || 'Unknown',
        location: {
          locality: restaurant.location?.locality || 'Unknown Location',
          country: {
            countryName: restaurant.location?.country?.countryName || 'Unknown Country',
          },
        },
        phone: '', // Update this if phone data is available
        averageCostForTwo: restaurant.averageCostForTwo || 0,
      }));

      setRestaurants((prev) => [...prev, ...fetchedRestaurants]);

      const nextPage = response.data.pagination.nextPage;
      setHasMore(nextPage !== null);

    } catch (error) {
      console.error('Error fetching restaurants:', error);
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
  }, [page]);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      const handleScroll = () => {
        const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
        const pageHeight = document.documentElement.scrollHeight;
        const triggerPosition = pageHeight * 0.8;

        if (scrollPosition >= triggerPosition) {
          if (hasMore && !loading) {
            setPage((prev) => prev + 1);
          }
        }
      };

      window.addEventListener('scroll', handleScroll);

      handleScroll();

      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [hasMore, loading, latitude, longitude]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isScrolled/>
      <main className="flex-grow bg-gray-100 py-8">
        <LocationPopup onLocationSelect={handleLocationSelect} />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Restaurants Near Your Location
        </h1>
        {loading && <p className="text-center">Loading...</p>}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
          {!hasMore && <p className="text-center mt-4">No more restaurants to load.</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LocationSearch;
