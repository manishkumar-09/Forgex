// Load environment variables immediately
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

import app from "./app";
import { ENV } from "./config/env";
import { startCleanupJob } from "./services/cleanup.service";

const port = ENV.PORT;

//cleanup cron job
// startCleanupJob()

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
