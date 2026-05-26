import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  //  Multer errors
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  //  Custom errors
  if (err instanceof Error) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }

  //  Fallback
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
