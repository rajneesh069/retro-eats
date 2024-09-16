"use client";
import React, { useState } from "react";
import { MapPin, Upload, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleLocationSearch = () => {
    router.push("/locationSearch");
  };

  const handleUploadImage = () => {
    router.push("/upload");
  };

  return (
    <nav
      className={`sticky top-0 z-50 p-4 transition-all duration-300 ${
        isScrolled
          ? "bg-gradient-to-r from-purple-800 to-blue-800"
          : "bg-gradient-to-r from-gray-900 to-black"
      } shadow-lg`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-600 tracking-wide"
        >
          Swiggato
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={handleLocationSearch}
            className="flex items-center bg-gradient-to-r from-pink-500 to-red-600 text-white py-2 px-6 rounded-full transition-transform duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/50"
          >
            <MapPin className="w-6 h-6 mr-2" />
            Use My Location
          </button>
          <button
            onClick={handleUploadImage}
            className="flex items-center bg-gradient-to-r from-green-500 to-blue-600 text-white py-2 px-6 rounded-full transition-transform duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/50"
          >
            <Upload className="w-6 h-6 mr-2" />
            Search With Image
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none transform transition-transform duration-500"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-black bg-opacity-80 flex flex-col justify-center items-center space-y-8">
          <button
            onClick={handleLocationSearch}
            className="w-3/4 bg-gradient-to-r from-pink-500 to-red-600 text-white py-4 px-6 rounded-full transition-transform duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/50 flex items-center justify-center space-x-2"
          >
            <MapPin className="h-5 w-5" />
            <span>Use My Location</span>
          </button>
          <button
            onClick={handleUploadImage}
            className="w-3/4 bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 px-6 rounded-full transition-transform duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/50 flex items-center justify-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Image</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
