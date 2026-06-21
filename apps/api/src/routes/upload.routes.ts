import { Router } from "express";
import { uploadFile, uploadUrl } from "../controllers/upload.controller";

import { upload } from "../middleware/upload.middleware";

const uploadRouter = Router();

uploadRouter.post("/upload", upload.single("file"), uploadFile);
uploadRouter.post("/image/generate", uploadUrl);

export default uploadRouter;
