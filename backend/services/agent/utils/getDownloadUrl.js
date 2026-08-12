import cloudinary from "./cloudinary.js";

// fileName is expected to be the Cloudinary public_id or the filename used during upload
export const getDownloadUrl = async (fileName, expiresIn = 600) => {
  if (!fileName) throw new Error("Invalid file identifier for download");

  // Cloudinary public URLs are public by default (secure_url returned on upload).
  // Build a URL using the public_id. If the caller passed an object result from uploadToS3, handle that too.
  if (typeof fileName === "object" && fileName.secure_url) return fileName.secure_url;

  // Try to build URL via cloudinary.utils
  try {
    const url = cloudinary.url(fileName, { secure: true, resource_type: "auto" });
    return url;
  } catch (err) {
    throw new Error("Failed to build Cloudinary URL: " + err.message);
  }
};