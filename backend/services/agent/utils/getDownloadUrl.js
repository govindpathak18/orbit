import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "./s3.js";

const bucketName = process.env.AWS_BUCKET_NAME;
if (!bucketName || bucketName === "add AWS bucket name") {
  throw new Error(
    "AWS_BUCKET_NAME is not configured properly. Please set a valid S3 bucket name in the environment."
  );
}

export const getDownloadUrl = async (fileName, expiresIn = 600) => {
  return await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    }),
    { expiresIn }
  );
};