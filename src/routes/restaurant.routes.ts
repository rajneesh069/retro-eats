import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import {
  getRestaurantById,
  getRestaurantLocation,
  restaurantListController,
} from "../controllers/restaurant.controllers";

const client = new PrismaClient();
const router = Router();

router.get("/list", restaurantListController);

router.get("/", getRestaurantById);

router.get("/location", getRestaurantLocation);

export const restaurantRouter = router;
