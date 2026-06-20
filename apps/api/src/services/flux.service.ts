import { ENV } from "../config/env";
import { buildPrompt, Style } from "./prompt.service";

export const generateWithFlux = async ({
  imageUrl,
  style,
  productName,
  category,
}: {
  imageUrl: string;
  style: Style;
  productName?: string;
  category?: string;
}) => {
  const { prompt, negative_prompt } = buildPrompt({
    style,
    productName,
    category,
  });

  const res = await fetch(ENV.FLUX_API_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ENV.FLUX_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      negativePrompt: negative_prompt,
      image: imageUrl, // input image
    }),
  });

  if (!res.ok) {
    throw new Error("Flux API failed");
  }

  const data = await res.json();

  return data.images; //  array of URLs
};
