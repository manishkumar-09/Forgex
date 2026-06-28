import { validateImageUrl } from "../utils/validateImage";
import { generateWithFlux } from "./flux.service";
import { Style } from "./prompt.service";
import { storeGeneratedImages } from "./storeGenerated.service";

export const generateImages = async ({
  imageUrl,
  style,
  productName,
}: {
  imageUrl: string;
  style: Style;
  productName: string;
}) => {
  const MAX_ATTEMPTS = 3;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    //call FLUX
    const generated = await generateWithFlux({ imageUrl, style, productName });

    //validate
    const validImages: string[] = [];

    for (const url of generated) {
      const isValid = await validateImageUrl(url);
      if (isValid) validImages.push(url);
    }

    //  If valid images found → store + return
    if (validImages.length > 0) {
      const stored = await storeGeneratedImages(validImages);
      return stored;
    }

    console.warn(`Retrying generation... attempt ${attempt}`);
  }

  throw new Error("Failed to generate consistent output");
};

// export const generateVideoFromImage = async({
//   image 
// })