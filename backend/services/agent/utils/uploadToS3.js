import cloudinary from "./cloudinary.js";

// Upload a buffer to Cloudinary using upload_stream.
// Returns an object similar to S3 key so existing code paths remain compatible.
export const uploadToS3 = (buffer, fileName, contentType) => {
  return new Promise((resolve, reject) => {
    try {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: fileName.replace(/\.[^.]+$/, ""),
          resource_type: "auto",
          overwrite: true,
        },
        (error, result) => {
          if (error) return reject(error);
          // Normalize return value to be the public_id so callers that expect a file key still work
          resolve({ public_id: result.public_id, secure_url: result.secure_url, resource_type: result.resource_type });
        }
      );

      // Write buffer to the stream
      stream.end(buffer);
    } catch (err) {
      reject(err);
    }
  });
};