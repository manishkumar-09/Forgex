import { Router } from "express";
import userRouter from "./user.routes";
import uploadRouter from "./upload.routes";
import healthRouter from "./health.routes";

const router = Router();

router.use("/api", userRouter);
router.use("/api", uploadRouter);
router.use("/api", healthRouter);

export default router;
