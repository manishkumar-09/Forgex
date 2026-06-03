import { Request, Response } from "express";
import { generateVideo } from "../services/runway.service";
import { storeVideoInR2 } from "../services/upload.service";

export const generateVideoController = async (req: Request, res: Response) => {
  try {
    const { imageUrl, prompt } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        message: "Image URL is required",
      });
    }

    //calling runway
    const result = await generateVideo({
      imageUrl,
      prompt: prompt || "Cinematic product video, smooth motion",
    });

    // sending response as json
    const videoUrl = result.output?.[0];

    //for testing
    res.json({ video: videoUrl });

    //saving into the bucket
    // const storeVideo = await storeVideoInR2(videoUrl);
    // res.json({ video: storeVideo });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Video generation failed",
    });
  }
};
