import React, { useState } from "react";

interface LocationPopupProps {
  onLocationSelect: (latitude: number, longitude: number) => void;
}

export const LocationPopup: React.FC<LocationPopupProps> = ({ onLocationSelect }) => {
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
    { name: "Ambiance Mall", latitude: 28.5055, longitude: 77.0960 },
    { name: "Connaught Place", latitude: 28.6304, longitude: 77.2177 },
    { name: "Chandni Chowk", latitude: 28.6505, longitude: 77.2303 },
    { name: "Clatskanie", latitude: 46.1041, longitude: -123.2039 },
  ];

  return showPopup ? (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Select Location</h2>
        <button
          className="bg-red-700 text-white py-2 px-4 rounded-lg mb-4 hover:bg-red-800 transition-colors duration-300"
          onClick={handleLocation}
        >
          Use my current location
        </button>
        <p className="text-gray-400 mb-4">or Select from top trending</p>
        <div className="grid grid-cols-2 gap-4">
          {trendingLocations.map((location) => (
            <button
              key={location.name}
              className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-300"
              onClick={() => {
                onLocationSelect(location.latitude, location.longitude);
                setShowPopup(false);
              }}
            >
              {location.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  ) : null;
};
