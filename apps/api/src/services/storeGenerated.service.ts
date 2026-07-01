import { PutObjectCommand } from "@aws-sdk/client-s3";
import { R2 } from "../config/r2";
import { v4 as uuid } from "uuid";
import { ENV } from "../config/env";

export const storeGeneratedImages = async (urls: string[]) => {
  const results: string[] = [];

  for (const url of urls) {
    const res = await fetch(url);
    const buffer = Buffer.from(await res.arrayBuffer());

    const key = `generated/${uuid()}.webp`;

    await R2.send(
      new PutObjectCommand({
        Bucket: ENV.R2_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: "image/webp",
      }),
    );
    results.push(`${ENV.R2_PUBLIC_URL}/${key}`);
  }
  return results;
};
