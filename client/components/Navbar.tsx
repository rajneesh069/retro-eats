"use client"

import React from "react"
import { MapPin, Upload, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Navbar() {
  const router = useRouter()

  const handleLocationSearch = () => {
    router.push("/locationSearch")
  }

  const handleUploadImage = () => {
    router.push("/upload")
  }

  return (
    <nav className="sticky top-0 z-50 bg-zinc-900/90 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          className="text-3xl sm:text-4xl font-cursive font-semibold text-amber-400 tracking-wide hover:text-amber-300 transition-colors duration-200"
        >
          Retro Eats
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleLocationSearch}
            className="flex items-center bg-zinc-800 text-amber-400 hover:bg-zinc-700 hover:text-amber-300 border-zinc-700"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Locate Me
          </Button>
          <Button
            variant="outline"
            onClick={handleUploadImage}
            className="flex items-center bg-zinc-800 text-amber-400 hover:bg-zinc-700 hover:text-amber-300 border-zinc-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Image Search
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-amber-400 hover:bg-zinc-800 hover:text-amber-300"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-zinc-900 border-zinc-800">
            <SheetHeader>
              <SheetTitle className="text-2xl font-cursive text-amber-400">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-4 mt-8">
              <Button
                variant="outline"
                className="w-full py-6 flex items-center justify-center space-x-2 bg-zinc-800 text-amber-400 hover:bg-zinc-700 hover:text-amber-300 border-zinc-700"
                onClick={() => {
                  handleLocationSearch()
                }}
              >
                <MapPin className="h-5 w-5" />
                <span>Use My Location</span>
              </Button>
              <Button
                variant="outline"
                className="w-full py-6 flex items-center justify-center space-x-2 bg-zinc-800 text-amber-400 hover:bg-zinc-700 hover:text-amber-300 border-zinc-700"
                onClick={() => {
                  handleUploadImage()
                }}
              >
                <Upload className="h-5 w-5" />
                <span>Upload Image</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}