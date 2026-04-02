import "dotenv/config";
import express from "express";
import cors from "cors";

import feedRoutes from "./routes/feed.routes.js";
import articleRoutes from "./routes/article.routes.js";
import authRoutes from "./routes/auth.routes.js";
import folderRoutes from "./routes/folder.routes.js";
import summaryRoutes from "./routes/summary.routes.js";
import { swaggerDocs } from "./docs/swagger.js";
import { logger } from "./utils/logger.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.originalUrl, user: req.user?.id || null }, "Incoming request");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/feeds", feedRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/folders", folderRoutes);

swaggerDocs(app);

app.get("/", (req, res) => {
  res.send("FeedForge API running");
});

app.use((err, req, res, next) => {
  logger.error({ err: err?.message || err, stack: err?.stack }, "Unhandled error");
  res.status(500).json({ message: "Internal server error" });
});

export default app;