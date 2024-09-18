"use client";

import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface LocationPopupProps {
  onLocationSelect: (latitude: number, longitude: number) => void;
}

export function LocationPopup({ onLocationSelect }: LocationPopupProps) {
  const [showPopup, setShowPopup] = useState(true);

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationSelect(latitude, longitude);
          setShowPopup(false);
        },
        (error) => {
          alert("Failed to fetch location: " + error.message);
        }
      );
    } else {
      alert("Geolocation not supported by your browser.");
    }
  };

  const trendingLocations = [
    { name: "Ambiance Mall", latitude: 28.5055, longitude: 77.096 },
    { name: "Connaught Place", latitude: 28.6304, longitude: 77.2177 },
    { name: "Chandni Chowk", latitude: 28.6505, longitude: 77.2303 },
    { name: "Clatskanie", latitude: 46.1041, longitude: -123.2039 },
  ];

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-purple-600 text-white">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-purple-400 mb-4">
            Select Location
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Button
            variant="outline"
            className="w-full text-lg font-semibold bg-teal-900 hover:bg-teal-800 text-teal-300 border-teal-600 hover:text-teal-200 transition-all duration-300 shadow-[0_0_15px_rgba(0,128,128,0.5)] hover:shadow-[0_0_20px_rgba(0,128,128,0.7)]"
            onClick={handleLocation}
          >
            <MapPin className="mr-2 h-5 w-5" />
            Use my current location
          </Button>
          <div className="text-center">
            <p className="text-purple-300 mb-4">or Select from top trending</p>
            <div className="grid grid-cols-2 gap-4">
              {trendingLocations.map((location) => (
                <Card
                  key={location.name}
                  className="bg-gray-800 border-purple-600 hover:bg-gray-700 transition-all duration-300 group"
                >
                  <CardContent className="p-0">
                    <Button
                      variant="ghost"
                      className="w-full h-full py-4 px-2 text-sm font-medium text-purple-300 group-hover:text-purple-200"
                      onClick={() => {
                        onLocationSelect(location.latitude, location.longitude);
                        setShowPopup(false);
                      }}
                    >
                      {location.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
