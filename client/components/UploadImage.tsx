"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Upload } from "lucide-react";
import axios from "axios";
import Footer from "@/components/Footer";
import FormData from "form-data";
import { SERVER_URL } from "@/utils/config";
import { cuisines } from "@/utils/constants";
import { Restaurant } from "@/app/locationSearch/page";
import { RestaurantCard } from "./RestaurantCard";
const UploadImage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress] = useState<number>(0);
  const [uploadMessage] = useState<string | null>(null);
  const [isUploading] = useState<boolean>(false);
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
    const formdata = new FormData();
    formdata.append("image", selectedFile);
    try {
      const res = await axios.post(`${SERVER_URL}/api/v1/recognizeImage`, formdata, {
        headers : {
          "Content-Type" :"multipart/formdata"
        }
      })
      const dishName:string = res.data.tagWith100Confidence.tag.en;
      const cuisineName:string = cuisines[dishName] || 'Indian'
      console.log(cuisineName);


      const restaurantList = await axios.get(`${SERVER_URL}/api/v1/restaurant/list?cuisines=${cuisineName}`);
      console.log(restaurantList.data);
      if(restaurantList.data) setData(restaurantList.data.data)
    
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      // Clean up the object URL to avoid memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <>
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-6">Upload Image</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="image-upload"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Choose an image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-red-300 border-dashed rounded-md transition-transform transform hover:scale-105 hover:border-red-400">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-red-400 transition-transform transform hover:scale-125" />
                  <div className="flex text-sm text-gray-500">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              {previewUrl ? (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preview
                  </label>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-auto rounded-lg shadow-lg transition-transform transform hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200 rounded-lg">
                  <p className="text-gray-500">
                    Image preview will appear here
                  </p>
                </div>
              )}
            </div>
            {error && (
              <div className="col-span-2 text-red-600 text-sm mt-2">
                {error}
              </div>
            )}
            <div className="col-span-2">
              {isUploading ? (
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-red-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform transform hover:scale-105"
                >
                  Upload Image
                </button>
              )}
            </div>
            {isUploading && (
              <>
                <div className="col-span-2 text-center text-sm text-gray-500">
                  Uploading... {uploadProgress}%
                </div>
                <div className="col-span-2 text-center text-sm text-gray-500">
                  {uploadMessage}
                </div>
              </>
            )}
          </form>

          <div className="mt-5 p-2">
          {
            data.length!==0 ? data.map((restaurant)=> <RestaurantCard key={restaurant.id} restaurant={restaurant}/>) : null
          }
          </div>

        </div>
      </div>
    </div>
    <Footer /> {/* Add the Footer component */}
      </>
  );
};

export default UploadImage;
