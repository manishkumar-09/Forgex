import { ENV } from "../config/env";
import RunwayML, { TaskFailedError } from "@runwayml/sdk";

//Intialize client with API Key;
const client = new RunwayML({
  apiKey: ENV.RUNWAY_API_KEY,
});

export const generateVideo = async ({
  imageUrl,
  prompt,
}: {
  imageUrl: string;
  prompt: string;
}) => {
  try {
    const imageToVideo = await client.imageToVideo
      .create({
        model: "gen4_turbo",
        promptImage: imageUrl,
        promptText: prompt,
        ratio: "1280:720",
        duration: 5,
      })
      .waitForTaskOutput(); //handle polling internally

    return imageToVideo;
  } catch (err) {
    if (err instanceof TaskFailedError) {
      console.error("Runway task failed", err.taskDetails);
      throw new Error("Video generation failed");
    }
    throw err;
  }
};
