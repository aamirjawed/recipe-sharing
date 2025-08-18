import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload file to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",   // ✅ detect as image
      folder: "recipes"         // ✅ optional: keep uploads organized
    });

    // File uploaded successfully
    console.log("Cloudinary upload success:", response.secure_url);

    // Remove the temp file
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    fs.unlinkSync(localFilePath); // cleanup
    return null;
  }
};

export { uploadOnCloudinary };
