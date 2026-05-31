import { NextFunction, Request, Response } from "express";
import { allowedMimeTypes } from "../middleware/upload.middleware";
import { uploadToR2WithRembg } from "../services/upload.service";
import { generateImages } from "../services/generate.service";

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type",
      });
    }
    const result = await uploadToR2WithRembg(req.file);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    next(error); //pass to error handler
  }
};

export const uploadUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { imageUrl, style, product } = req.body;

    if (!imageUrl || !style || !product) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const validStyles = ["amazon", "luxury", "lifestyle"];

    if (!validStyles.includes(style)) {
      return res.status(400).json({ message: "Invalid style" });
    }

    const safeProduct = product.trim().slice(0, 100) || "product";
    const images = await generateImages({
      imageUrl,
      style,
      productName: safeProduct,
    });

    res.json({ images });
  } catch (error) {
    next(error instanceof Error ? error : new Error("Generation Failed"));
  }
};
