"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Upload } from "lucide-react";
import axios from "axios";
import FormData from "form-data";
import { SERVER_URL } from "@/utils/config";
import { cuisines } from "@/utils/constants";
import { Restaurant } from "@/app/locationSearch/page";
import RestaurantCard from "./RestaurantCard";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UploadImage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [data, setData] = useState<Restaurant[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.substr(0, 5) === "image") {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError("Please select a valid image file.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadMessage("Uploading...");

    const formdata = new FormData();
    formdata.append("image", selectedFile);

    try {
      const res = await axios.post(
        `${SERVER_URL}/api/v1/recognizeImage`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      setUploadMessage("Processing image...");
      const dishName: string = res.data.tagWith100Confidence.tag.en;
      const cuisineName: string = cuisines[dishName] || "Indian";

      setUploadMessage("Fetching restaurants...");
      const restaurantList = await axios.get(
        `${SERVER_URL}/api/v1/restaurant/list?cuisines=${cuisineName}`
      );

      if (restaurantList.data) setData(restaurantList.data.data);
      setUploadMessage(null);
    } catch (error) {
      console.error(error);
      setError("An error occurred while processing your request.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-3xl mx-auto bg-gray-800 text-gray-100 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-red-500">
            Upload Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="image-upload" className="text-gray-300">
                  Choose an image
                </Label>
                <div className="flex items-center justify-center w-full h-32 px-4 transition bg-gray-700 border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                  <span className="flex items-center space-x-2">
                    <Upload className="w-6 h-6 text-gray-300" />
                    <span className="font-medium text-gray-300">
                      Drop files to Attach, or
                      <Input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                      <label
                        htmlFor="image-upload"
                        className="text-red-500 hover:text-red-400 ml-1 cursor-pointer"
                      >
                        browse
                      </label>
                    </span>
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Preview</Label>
                {previewUrl ? (
                  <div className="relative w-full h-64 overflow-hidden rounded-md">
                    <Image
                      fill
                      src={previewUrl}
                      alt="Preview"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-32 bg-gray-700 rounded-md">
                    <p className="text-gray-400">
                      Image preview will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div>
              {isUploading ? (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-center text-sm text-gray-400">
                    {uploadMessage} {uploadProgress}%
                  </p>
                </div>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={!selectedFile}
                >
                  Upload Image
                </Button>
              )}
            </div>
          </form>

          <div className="mt-8 space-y-4">
            {data.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
