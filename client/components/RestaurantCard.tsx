import React from 'react';
import Link from 'next/link';
import { StarIcon, MapPinIcon, PhoneIcon } from 'lucide-react';

// Define the Restaurant interface directly in this file
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

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link href={`/restaurant/${restaurant.id}`} passHref>
      <div className="block bg-black text-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl overflow-hidden cursor-pointer">
        <div className="relative">
          <img
            src={restaurant.image || 'default-image-url.jpg'}
            alt={restaurant.name}
            className="w-full h-48 object-cover"
          />
          {/* Optional: Tint Overlay */}
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>
        <div className="p-4 relative">
          <h3 className="text-2xl font-bold mb-2">{restaurant.name}</h3>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-5 h-5 ${i < (restaurant.rating ?? 0) ? 'text-red-500' : 'text-gray-400'}`}
                fill={i < (restaurant.rating ?? 0) ? 'currentColor' : 'none'}
              />
            ))}
            <span className="ml-2 text-lg">{restaurant.rating?.toFixed(1) || 'N/A'}</span>
          </div>
          <p className="text-gray-400 mb-2 font-medium">{restaurant.cuisine}</p>
          <div className="flex items-center text-gray-400 mb-2">
            <MapPinIcon className="w-5 h-5 mr-2" />
            <span>{restaurant.location.locality || 'Unknown Location'}</span>
          </div>
          <div className="flex items-center text-gray-400">
            <PhoneIcon className="w-5 h-5 mr-2" />
            <span>{restaurant.phone || 'N/A'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
