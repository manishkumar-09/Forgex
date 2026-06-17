export type Style = "amazon" | "luxury" | "lifestyle";

type PromptInput = {
  style: Style;
  productName?: string;
  category?: string;
};

export const buildPrompt = ({ style, productName, category }: PromptInput) => {
  const base = `
A professional product photograph of ${productName || "a product"}${
    category ? ` (${category})` : ""
  }. Centered composition, studio lighting, softbox, DSLR, 85mm lens, sharp focus.
Studio lighting, balanced exposure, Clean edges. 
`;

  const styles: Record<Style, string> = {
    amazon: `
Pure white background (#FFFFFF), soft shadow.
Even lighting, clean e-commerce style, no reflections, no clutter.
`,

    luxury: `
Dark elegant background, cinematic lighting.
High contrast, glossy finish, premium luxury aesthetic.
`,

    lifestyle: `
Real-life environment, natural lighting.
Shallow depth of field, realistic setting, candid lifestyle scene.
`,
  };

  const negativePrompt =
    "blurry, low quality, distorted, watermark, text, logo, extra objects, duplicate product, cropped, bad lighting";

  return {
    prompt: `${base} ${styles[style]}`,
    negative_prompt: negativePrompt,
  };
};
