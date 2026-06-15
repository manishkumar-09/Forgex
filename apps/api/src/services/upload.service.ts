import { PutObjectCommand } from "@aws-sdk/client-s3";
import { R2 } from "../config/r2";
import { v4 as uuid } from "uuid";
import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";
import { ENV } from "../config/env";
import { Retry } from "../utils/retry";
import { standardizeImage } from "./image.service";

const execPromise = (cmd: string) =>
  new Promise((resolve, reject) => {
    exec(cmd, (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });

export const uploadToR2WithRembg = async (file: Express.Multer.File) => {
  const id = uuid();

  const inputPath = path.join("tmp", `${id}-input.png`);
  const outputPath = path.join("tmp", `${id}-output.png`);

  //ensure tmp folder
  await fs.ensureDir("tmp");
  console.log("tmp folder triggered");
  //save input file
  await fs.writeFile(inputPath, file.buffer);

  //run rembg
  const REMBG_PATH =
    "C:\\Users\\iamma\\AppData\\Local\\Programs\\Python\\Python311\\Scripts\\rembg.exe";

  await Retry(
    () =>
      execPromise(
        `"${REMBG_PATH}" i -m isnet-general-use "${inputPath}" "${outputPath}"`,
      ),
    3,
    1000,
  );

  //read processed file
  // const processedBuffer = await fs.readFile(outputPath);
  const rawBuffer = await fs.readFile(outputPath);

  // multiple size images
  // const { thumbnail, preview, hd } = await standardizeImage(rawBuffer);
  const { hd } = await standardizeImage(rawBuffer);

  // helper upload
  const upload = async (buffer: Buffer, suffix: string) => {
    const key = `uploads/${id}-${suffix}.webp`;

    //upload to R2
    await Retry(
      () =>
        R2.send(
          new PutObjectCommand({
            Bucket: ENV.R2_BUCKET!,
            Key: key,
            Body: buffer,
            ContentType: "image/png",
          }),
        ),
      3,
      1000,
    );
    return `${ENV.R2_PUBLIC_URL}/${key}`;
  };

  //upload all sizes
  // const thumbnailUrl = await upload(thumbnail, "thumb");
  // const previewUrl = await upload(preview, "preview");
  const hdUrl = await upload(hd, "hd");

  //cleanup
  await fs.remove(inputPath);
  await fs.remove(outputPath);
  console.log("removed from tmp");

  // const processedBuffer = await standardizeImage(rawBuffer);

  return {
    // thumbnail: thumbnailUrl,
    // preview: previewUrl,
    hd: hdUrl,
  };
};
