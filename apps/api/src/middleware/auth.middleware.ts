import { Request, Response, NextFunction } from "express";
import { authAdmin } from "../config/firebaseAdmin";
import { syncUser } from "../services/user.service";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    const decoded = await authAdmin.verifyIdToken(token);

    //Sync user with DB
    const user = await syncUser(decoded);

    //attach user to the request
    req.user = user;

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
    });
  }
};
