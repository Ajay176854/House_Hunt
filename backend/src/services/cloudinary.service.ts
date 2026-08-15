import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { config } from "../config";
import { createApiError } from "../middleware/errorHandler";

// Initialize Cloudinary with fallback config for development if not provided
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "demo",
  api_key: process.env.CLOUDINARY_API_KEY || "demo_key",
  api_secret: process.env.CLOUDINARY_API_SECRET || "demo_secret",
});

/**
 * Uploads a buffer directly to Cloudinary using streams.
 * Avoids saving files to disk.
 */
export const uploadToCloudinary = (buffer: Buffer, folder: string = "househunt/properties"): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If running in development without real cloudinary keys, just return a fake URL or fail gracefully
    if (process.env.CLOUDINARY_CLOUD_NAME === "demo" || !process.env.CLOUDINARY_CLOUD_NAME) {
      return resolve("https://res.cloudinary.com/demo/image/upload/sample.jpg");
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          console.error("Cloudinary Upload Error:", error);
          reject(createApiError("Image upload failed", 500));
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};
