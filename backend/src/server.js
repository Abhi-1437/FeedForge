import app from "./app.js";
import { connectDB } from "./config/db.js";
import { startCron } from "./services/cron.service.js";
import { logger } from "./utils/logger.js";

startCron();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info({ port: PORT }, "Server running");
  });
});