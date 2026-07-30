import { PutObjectCommand } from "@aws-sdk/client-s3";

import { s3 } from "./s3.js";

const bucketName = process.env.AWS_BUCKET_NAME;
if (!bucketName || bucketName === "add AWS bucket name") {
  throw new Error(
    "AWS_BUCKET_NAME is not configured properly. Please set a valid S3 bucket name in the environment."
  );
}

export const uploadToS3 = async (buffer, fileName, contentType) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return fileName;
};