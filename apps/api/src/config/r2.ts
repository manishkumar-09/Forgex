import { S3Client } from "@aws-sdk/client-s3";
import { ENV } from "./env";

export const R2 = new S3Client({
  region: "auto",
  endpoint: ENV.R2_ENDPOINT,
  credentials: {
    accessKeyId: ENV.R2_ACCESS_KEY_ID!,
    secretAccessKey: ENV.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});
