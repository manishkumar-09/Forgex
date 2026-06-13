import { Request, Response } from "express";
const healthController = (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
};

export default healthController;
