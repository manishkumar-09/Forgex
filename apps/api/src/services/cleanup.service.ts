import cron from "node-cron";
import { DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { R2 } from "../config/r2";
import { ENV } from "../config/env";

const DAYS_OLD = 15;

export const startCleanupJob = () => {
  // Every day at midnight

  cron.schedule("0 0 * * *", async () => {
    console.log("Running cleanup job...");

    try {
      const objects = await R2.send(
        new ListObjectsV2Command({
          Bucket: ENV.R2_BUCKET!,
        }),
      );

      if (!objects.Contents) return;

      const now = Date.now();

      for (const file of objects.Contents) {
        if (!file.Key || !file.LastModified) {
          continue;
        }
        const age = now - new Date(file.LastModified).getTime();

        const days = age / (1000 * 60 * 60 * 24); //milliseconds to days [ms*sec*min*hr]

        //Delete old files
        if (days > DAYS_OLD) {
          await R2.send(
            new DeleteObjectCommand({
              Bucket: ENV.R2_BUCKET!,
              Key: file.Key,
            }),
          );
          console.log(`Deleted: ${file.Key}`);
        }
      }
    } catch (err) {
      console.error("Cleanup failed", err);
    }
  });
};
