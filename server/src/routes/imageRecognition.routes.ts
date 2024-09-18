import express from "express";
import { imageRecognitionController } from "../controllers/image.controllers";
import { upload } from "../middlewares/multer.middleware";
const router = express.Router();

router.post("/", upload.single("image"), imageRecognitionController);

export const imageRecognitionRouter = router;
