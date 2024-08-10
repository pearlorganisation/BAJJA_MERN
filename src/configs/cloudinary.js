import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFileToCloudinary = async (files) => {
  try {
    let resultArr = await Promise.all(
      files.map(async (file) => {
        try {
          const res = await cloudinary.uploader.upload(file.path, {
            folder: "uploads",
          });
          // Deleting the file after successful upload
          fs.unlink(file.path, (err) => {
            if (err) {
              console.error("Error deleting file from disk:", err);
            } else {
              console.log("File deleted from disk:", file.path);
            }
          });
          return res;
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError);
          return null; // or handle error as per your requirement
        }
      })
    );

    return { status: true, result: resultArr.filter(Boolean) };
  } catch (error) {
    return { status: false, message: error?.message };
  }
};
