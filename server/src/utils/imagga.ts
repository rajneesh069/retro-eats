import { IMAGGA_API_KEY, IMAGGA_API_SECRET } from "./config";
import axios from "axios";

const apiKey = IMAGGA_API_KEY;
const apiSecret = IMAGGA_API_SECRET;

export const imageTags = async (imageUrl: string) => {
  const url = `https://api.imagga.com/v2/tags?image_url=${encodeURIComponent(
    imageUrl
  )}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString(
          "base64"
        )}`,
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error(error?.response?.data || "An error occurred");
  }
};
