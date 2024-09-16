"use client"
import React from "react";
import { MapPin } from "lucide-react";

const MapLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="relative w-24 h-24 mb-4">
        <div className="absolute inset-0 bg-blue-200 rounded-full "></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <MapPin size={24} className="text-red-600 animate-bounce" />
        </div>
      </div>
      <p className="mt-6 text-xl  animate-pulse font-semibold text-gray-700">
        Searching nearby restaurants...
      </p>{" "}
      <p className="mt-2 text-gray-500">This may take a moment</p>
    </div>
  );
};

export default MapLoader;
