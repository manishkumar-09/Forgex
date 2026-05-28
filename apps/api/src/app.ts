import express, { Request, Response } from "express";
import cors from "cors";
import healthRouter from "./routes/health.routes";
import { errorHandler } from "./middleware/error.middleware";
import router from "./routes/main.routes";

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use(router);

//error
app.use(errorHandler);

export default app;
