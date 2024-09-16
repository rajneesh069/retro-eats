import { Request, Response } from "express";
import { imageTags } from "../utils/imagga";
import { uploadOnCloudinary } from "../utils/cloudinary";
import fs from "fs";
import { findTagWithHighestConfidence } from "../utils/extractTag";

export async function imageRecognitionController(req: Request, res: Response) {
  const localFilePath = req.file?.path;

  if (!localFilePath) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
    const cloudinaryResult = await uploadOnCloudinary(localFilePath);
    //@ts-ignore
    if (!cloudinaryResult || !cloudinaryResult.secure_url) {
      return res
        .status(500)
        .json({ message: "Failed to upload image to Cloudinary." });
    }
    //@ts-ignore
    const imageUrl = cloudinaryResult.secure_url;

    const tags = await imageTags(imageUrl);
    const tagWith100Confidence = findTagWithHighestConfidence(
      tags.result?.tags
    );
    fs.unlinkSync(localFilePath);

    return res.status(200).json({
      message: "Tags generated successfully",
      tagWith100Confidence,
    });
  } catch (error) {
    console.error(error);
    fs.unlinkSync(localFilePath);
    return res
      .status(500)
      .json({ message: "An error occurred during image processing." });
  }
}
