import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { calculateArea } from "../utils/areaCalc";

const client = new PrismaClient();

export const restaurantListController = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 3;

  const countryId = (req.query.countryId as string) || undefined;
  const averageCostForTwo =
    parseInt(req.query.averageCostForTwo as string) || undefined;
  const cuisines = req.query.cuisines as string || undefined;

  try {
    const data = await client.restaurant.findMany({
      where: {
        ...(countryId && {
          location: {
            countryId: countryId,
          },
        }),
        ...(averageCostForTwo !== undefined && {
          averageCostForTwo: {
            lte: averageCostForTwo,
          },
        }),
        ...(cuisines && {
          cuisines: {
            contains: cuisines,
          },
        }),
      },
      select: {
        restaurant_id: true,
        name: true,
        thumbImage: true,
        ratingColor: true,
        aggregateRating: true,
        averageCostForTwo: true,
        cuisines: true,
        location: {
          select: {
            country: {
              select: {
                countryName: true,
              },
            },
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalCount = await client.restaurant.count({
      where: {
        ...(countryId && {
          location: {
            countryId: countryId,
          },
        }),
        ...(averageCostForTwo !== undefined && {
          averageCostForTwo: {
            lte: averageCostForTwo,
          },
        }),
        ...(cuisines && {
          cuisines: {
            contains: cuisines,
          },
        }),
      },
    });
    const hasNextPage =
      data.length === pageSize && page * pageSize < totalCount;

    res.json({
      data,
      pagination: {
        currentPage: page,
        pageSize,
        nextPage: hasNextPage ? page + 1 : null,
      },
    });
  } catch (error) {
    console.error("Prisma Error:", error);
    res.status(500).json({ error: "Error fetching restaurants" });
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  const restaurantId = parseInt(req.query.id as string);

  if (isNaN(restaurantId)) {
    return res.status(400).json({ error: "Invalid restaurant ID" });
  }

  try {
    // Fetch the restaurant data along with location and country
    const restaurant = await client.restaurant.findUnique({
      where: {
        restaurant_id: restaurantId,
      },
      include: {
        location: {
          include: {
            country: true,
          },
        },
      },
    });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const response = {
      Restaurant: {
        restaurant_id: restaurant.restaurant_id,
        name: restaurant.name,
        cuisines: restaurant.cuisines,
        featuredImage: restaurant.featuredImage,
        thumbImage: restaurant.thumbImage,
        ratingText: restaurant.ratingText,
        ratingColor: restaurant.ratingColor,
        aggregateRating: restaurant.aggregateRating,
        votes: restaurant.votes,
        averageCostForTwo: restaurant.averageCostForTwo,
        hasTableBooking: restaurant.hasTableBooking,
        hasOnlineDelivery: restaurant.hasOnlineDelivery,
        isDeliveringNow: restaurant.isDeliveringNow,
        location: {
          latitude: restaurant.location.latitude,
          longitude: restaurant.location.longitude,
          address: restaurant.location.address,
          city: restaurant.location.city,
          locality: restaurant.location.locality,
          country: restaurant.location.country.countryName,
        },
      },
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRestaurantLocation = async (req: Request, res: Response) => {
  const { latitude, longitude, page = 1, pageSize = 3 } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  const userLatitude = parseFloat(latitude as string);
  const userLongitude = parseFloat(longitude as string);
  const radiusKm = 3;

  const { minLat, maxLat, minLon, maxLon } = calculateArea(
    userLatitude,
    userLongitude,
    radiusKm
  );

  try {
    const restaurants = await client.restaurant.findMany({
      where: {
        location: {
          latitude: {
            gte: minLat,
            lte: maxLat,
          },
          longitude: {
            gte: minLon,
            lte: maxLon,
          },
        },
      },
      orderBy: {
        aggregateRating: "desc", // Sort by aggregateRating in descending order
      },
      select: {
        restaurant_id: true,
        name: true,
        thumbImage: true,
        ratingColor: true,
        aggregateRating: true,
        location: {
          select: {
            locality: true,
          },
        },
      },
      skip: (parseInt(page as string) - 1) * parseInt(pageSize as string),
      take: parseInt(pageSize as string),
    });

    // Count the total number of restaurants within the bounding box for pagination
    const totalCount = await client.restaurant.count({
      where: {
        location: {
          latitude: {
            gte: minLat,
            lte: maxLat,
          },
          longitude: {
            gte: minLon,
            lte: maxLon,
          },
        },
      },
    });

    const hasNextPage =
      parseInt(page as string) * parseInt(pageSize as string) < totalCount;

    res.json({
      data: restaurants,
      pagination: {
        currentPage: parseInt(page as string),
        pageSize: parseInt(pageSize as string),
        nextPage: hasNextPage ? parseInt(page as string) + 1 : null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching restaurants" });
  }
};
