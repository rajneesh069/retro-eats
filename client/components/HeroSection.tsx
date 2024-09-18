'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
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

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wider animate-fade-in drop-shadow-lg">
          Welcome to Retro Eats
        </h1>
        <p className="text-gray-400 mt-4 text-base sm:text-lg md:text-xl max-w-md sm:max-w-lg md:max-w-2xl animate-slide-up drop-shadow-md">
          Best dining experiences in your area with Retro Eats.
        </p>
        {/* Button */}
        <Button
          asChild
          className="mt-8 px-6 py-3 text-lg font-semibold bg-purple-600 hover:bg-purple-700 transition-transform transform hover:scale-105 shadow-lg"
          size="lg"
        >
          <Link href="/upload">
            Get Started
          </Link>
        </Button>
      </div>
    </div>
  )
}