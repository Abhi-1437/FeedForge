// Feed routes
import express from "express";
import Feed from "../models/Feed.js";
import Folder from "../models/Folder.js";
import Article from "../models/Article.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { url, title, folderId } = req.body;

  if (!url) {
    return res.status(400).json({ message: "Feed URL is required" });
  }

  if (folderId) {
    const folder = await Folder.findOne({ _id: folderId, userId: req.user.id });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
  }

  const feed = await Feed.create({
    url,
    title,
    userId: req.user.id,
    folderId: folderId || null,
  });

  res.json(feed);
});

router.get("/", async (req, res) => {
  const filters = {};
  if (req.user?.id) {
    filters.userId = req.user.id;
  }
  if (req.query.folderId) filters.folderId = req.query.folderId;

  const feeds = await Feed.find(filters).sort({ createdAt: -1 });
  res.json(feeds);
});

router.get("/:id", async (req, res) => {
  const filters = { _id: req.params.id };
  if (req.user?.id) filters.userId = req.user.id;

  const feed = await Feed.findOne(filters);
  if (!feed) {
    return res.status(404).json({ message: "Feed not found" });
  }
  res.json(feed);
});

router.patch("/:id", authMiddleware, async (req, res) => {
  const { url, title, folderId } = req.body;
  const feed = await Feed.findOne({ _id: req.params.id, userId: req.user.id });

  if (!feed) {
    return res.status(404).json({ message: "Feed not found" });
  }

  if (folderId) {
    const folder = await Folder.findOne({ _id: folderId, userId: req.user.id });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    feed.folderId = folderId;
    await Article.updateMany({ feedId: feed._id }, { folderId });
  }

  if (url) feed.url = url;
  if (title) feed.title = title;

  await feed.save();
  res.json(feed);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const deletedFeed = await Feed.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

  if (!deletedFeed) {
    return res.status(404).json({ message: "Feed not found" });
  }

  await Article.deleteMany({ feedId: deletedFeed._id });

  res.json({ message: "Feed deleted" });
});

export default router;