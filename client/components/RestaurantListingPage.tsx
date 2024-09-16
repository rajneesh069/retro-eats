"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { StarIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { SERVER_URL } from '@/utils/config';

interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number;
  cuisine: string;
  location: string;
  phone: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {

    return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <div className="bg-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl overflow-hidden cursor-pointer">
        <img
          src={restaurant.image || 'default-image-url.jpg'}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{restaurant.name}</h3>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-5 h-5 ${i < restaurant.rating? 'text-yellow-400' : 'text-gray-300'}`}
                fill={i < restaurant.rating ? 'currentColor' : 'none'}
              />
            ))}
            <span className="ml-2 text-gray-700 text-lg">{restaurant.rating.toFixed(1)}</span>
          </div>
          <p className="text-gray-600 mb-2 font-medium">{restaurant.cuisine}</p>
          <div className="flex items-center text-gray-500 mb-2">
            <MapPinIcon className="w-5 h-5 mr-2 text-gray-400" />
            <span>{restaurant.location}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <PhoneIcon className="w-5 h-5 mr-2 text-gray-400" />
            <span>{restaurant.phone || 'N/A'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const RestaurantListingPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    fetchRestaurants(page);
  }, [page]);

  const fetchRestaurants = async (pageNumber: number) => {
    if (!loading && hasMore) {
      setLoading(true);
      try {
        const response = await axios.get(
          `${SERVER_URL}/api/v1/restaurant/list?page=${pageNumber}`
        );
        const fetchedRestaurants = response.data.data.map((restaurant:{restaurant_id:string, name:string, thumbImage:string,aggregateRating:string,cuisines:string[], location : {country : {countryName:string}}}) => ({
          id: restaurant.restaurant_id,
          name: restaurant.name,
          image: restaurant.thumbImage || '',
          rating: restaurant.aggregateRating,
          cuisine: restaurant.cuisines || 'Unknown',
          location: restaurant.location?.country?.countryName || 'Unknown Location',
          phone: ''
        }));

        if (fetchedRestaurants.length > 0) {
          setRestaurants((prevRestaurants) => [...prevRestaurants, ...fetchedRestaurants]);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100 &&
      !loading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll, 200);
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [loading, hasMore]);

  const debounce = (func: () => void, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  };

  return (
    <div className="bg-gray-100 py-8 min-h-screen">
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Restaurant Listings</h1>

        {/* Restaurant Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center mt-4">
            <p>Loading more restaurants...</p>
          </div>
        )}

        {!hasMore && (
          <div className="text-center mt-4">
            <p>No more restaurants to load.</p>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default RestaurantListingPage;
