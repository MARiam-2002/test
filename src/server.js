import dotenv from "dotenv";
dotenv.config();

import app from "./index.js";
import { connectDB } from "./config/db.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("❌ Failed to start server:", err.message);
    process.exit(1);
  });
