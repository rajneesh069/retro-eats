"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const HeroSection: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Scroll effect to update background on the navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-screen w-full bg-gray-900">
      {/* Video Background */}
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/a.mp4"
          autoPlay
          muted
          loop
          aria-hidden="true"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-70"></div>
      </div>

      {/* Navbar */}
      <div
        className={`relative top-0 w-full z-10 transition-colors duration-300 ${
          isScrolled ? "bg-gray-800" : "bg-transparent backdrop-blur-md"
        }`}
      >
        <Navbar isScrolled={isScrolled} />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-white text-6xl font-extrabold tracking-wider animate-fade-in drop-shadow-lg">
          Welcome to Retro Eats
        </h1>
        <p className="text-gray-400 mt-4 text-lg animate-slide-up drop-shadow-md">
        Best dining experiences in your area with Retro Eats.
        </p>
        {/* Button */}
        <Link
          href={"/upload"}
          className="mt-8 px-6 py-3 text-lg font-semibold text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-transform transform hover:scale-105 shadow-lg"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
