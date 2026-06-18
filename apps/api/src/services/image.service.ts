import sharp from "sharp";

type OutputImages = {
  // thumbnail: Buffer;
  // preview: Buffer;
  hd: Buffer;
};

export const standardizeImage = async (
  inputBuffer: Buffer,
): Promise<OutputImages> => {
  const base = sharp(inputBuffer);

  return {
    //thumbnail (small)
    // thumbnail: await base
    //   .resize(200, 200, {
    //     fit: "cover",
    //   })
    //   .webp({ quality: 70 })
    //   .toBuffer(), //compression

    // Preview (medium)
    // preview: await base
    //   .resize(512, 512, {
    //     fit: "contain",
    //   })
    //   .webp({ quality: 80 })
    //   .toBuffer(),

    // HD (full optimized)
    hd: await base
      .resize(1024, 1024, {
        fit: "contain",
      })
      .webp({ quality: 90 })
      .toBuffer(),
  };
};
