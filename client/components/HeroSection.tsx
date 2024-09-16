'use client'
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

const HeroSection: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Scroll effect to update background on the navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-screen w-full">
      {/* Video Background */}
      <div className="absolute inset-0 h-[50vh] w-full overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/a.mp4"
          autoPlay
          muted
          loop
          aria-hidden="true"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
      </div>

      {/* Navbar */}
      <div
        className={`fixed top-0 w-full z-10 transition-colors duration-300 ${
          isScrolled ? "bg-black" : "bg-transparent backdrop-blur-md"
        }`}
      >
        <Navbar isScrolled={isScrolled} />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-[50vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-white text-6xl font-extrabold tracking-wider animate-fade-in">
          Welcome to Swiggato
        </h1>
        <p className="text-gray-300 mt-4 text-lg animate-slide-up">
          Discover the future with us
        </p>
        {/* Button */}
        <a
          href="#"
          className="mt-8 px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-transform transform hover:scale-105"
        >
          Get Started
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
