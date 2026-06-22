import { Router } from "express";
import { authenticate, AuthRequest } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.get("/public", (req, res) => {
  res.json({ message: "Public route" });
});

userRouter.get("/private", authenticate, (req: AuthRequest, res) => {
  res.json({
    message: "Private route",
    user: req.user,
  });
});

export default userRouter;
