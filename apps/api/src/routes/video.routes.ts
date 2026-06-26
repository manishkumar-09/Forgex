import { Router } from "express";
import { generateVideoController } from "../controllers/video.controller";

const videoRouter = Router();

videoRouter.post("/generate-video", generateVideoController);

export default Router;
