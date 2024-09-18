"use client"

import React, { useState } from "react"
import { MapPin, Upload, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  isScrolled: boolean
}

export default function Navbar({ isScrolled }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleLocationSearch = () => {
    router.push("/locationSearch")
  }

  const handleUploadImage = () => {
    router.push("/upload")
  }

  return (
    <nav
      className={`sticky top-0 z-50 p-4 transition-all duration-300 ${
        isScrolled ? "bg-gray-900" : "bg-gray-950"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          className="text-4xl font-cursive font-semibold text-white tracking-wide hover:opacity-80 transition-opacity duration-200"
        >
          Retro Eats
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleLocationSearch}
            className="flex items-center"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Locate Me
          </Button>
          <Button
            variant="outline"
            onClick={handleUploadImage}
            className="flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            Image Search
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-background/95 flex flex-col justify-center items-center space-y-8 z-[60] md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="h-8 w-8" />
          </Button>
          <Button
            variant="outline"
            className="w-3/4 py-4 px-6 flex items-center justify-center space-x-2"
            onClick={() => {
              setIsMenuOpen(false)
              handleLocationSearch()
            }}
          >
            <MapPin className="h-5 w-5" />
            <span>Use My Location</span>
          </Button>
          <Button
            variant="outline"
            className="w-3/4 py-4 px-6 flex items-center justify-center space-x-2"
            onClick={() => {
              setIsMenuOpen(false)
              handleUploadImage()
            }}
          >
            <Upload className="h-5 w-5" />
            <span>Upload Image</span>
          </Button>
        </div>
      )}
    </nav>
  )
}