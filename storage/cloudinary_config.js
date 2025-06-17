const cloudinary = require('cloudinary').v2;
require("dotenv").config();

cloudinary.config({ 
    cloud_name: 'djwajeqeu', 
    api_key: process.env.CLOUD_KEY, 
    api_secret: process.env.CLOUD_SECRET
});

// Utility function to upload image to Cloudinary
exports.uploadToCloudinary = async (filePath) => {
    if (!filePath) return null;
    try {
      const result = await cloudinary.uploader.upload(filePath);
      return result.url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return null;
    }
  }