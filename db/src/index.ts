import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const dataFilePath = path.join(__dirname, "/../files/file3.json");

// Helper function to load and parse JSON file
const loadData = () => {
  const fileData = fs.readFileSync(dataFilePath, "utf-8");
  return JSON.parse(fileData);
};

// Function to load data into the database
const loadDataToDb = async () => {
  try {
    const data = loadData();

    for (const item of data) {
      const { restaurants } = item;
      if (!restaurants) continue; // Skip if no restaurant data

      for (const restaurantWrapper of restaurants) {
        const restaurantData = restaurantWrapper.restaurant;

        if (
          !restaurantData.name ||
          !restaurantData.location ||
          !restaurantData.user_rating ||
          !restaurantData.average_cost_for_two
        ) {
          continue; // Skip records that are missing required fields
        }

        const {
          name,
          cuisines,
          thumb,
          featured_image,
          has_table_booking,
          has_online_delivery,
          is_delivering_now,
          location,
          user_rating,
          average_cost_for_two,
        } = restaurantData;

        const { address, city, locality, latitude, longitude, country_id } =
          location;

        const countryName = getCountryNameFromId(country_id); // Helper function

        const ratingText = user_rating.rating_text || "No Rating";
        const ratingColor = user_rating.rating_color || "FFFFFF";
        const aggregateRating = parseFloat(user_rating.aggregate_rating) || 0;
        const votes = parseInt(user_rating.votes) || 0;

        // Create or find the country first
        const country = await prisma.country.upsert({
          where: { countryId: country_id.toString() },
          update: {},
          create: {
            countryId: country_id.toString(),
            countryName: countryName || `Country-${country_id}`,
          },
        });

        // Create or find the location
        const locationRecord = await prisma.location.create({
          data: {
            latitude: parseFloat(latitude) || 0,
            longitude: parseFloat(longitude) || 0,
            address: address || "Unknown",
            city: city || "Unknown",
            locality: locality || "Unknown",
            countryId: country.countryId,
          },
        });

        // Create the restaurant record
        await prisma.restaurant.create({
          data: {
            name: name || "Unknown",
            cuisines: cuisines || "Not Specified",
            featuredImage: featured_image || "",
            thumbImage: thumb || "",
            ratingText: ratingText,
            ratingColor: ratingColor,
            aggregateRating: aggregateRating,
            votes: votes,
            averageCostForTwo: parseFloat(average_cost_for_two) || 0,
            hasTableBooking: !!has_table_booking,
            hasOnlineDelivery: !!has_online_delivery,
            isDeliveringNow: !!is_delivering_now,
            locationId: locationRecord.locationId,
          },
        });
      }
    }

    console.log("Data loaded successfully!");
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    await prisma.$disconnect();
  }
};

// Helper function to map country_id to country name
const getCountryNameFromId = (countryId: number) => {
  const countryMap: { [key: number]: string } = {
    1: "India",
    14: "Australia",
    // Add other country mappings as needed
  };
  return countryMap[countryId] || "Unknown Country";
};

// Run the data loading function
loadDataToDb();
