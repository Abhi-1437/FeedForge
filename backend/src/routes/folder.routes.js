// Folder routes
import express from "express";
import Folder from "../models/Folder.js";
import Feed from "../models/Feed.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Folder name is required" });
  }

  const folder = await Folder.create({
    name,
    userId: req.user.id,
  });

  res.json(folder);
});

router.get("/", async (req, res) => {
  const folders = await Folder.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(folders);
});

router.get("/:id", async (req, res) => {
  const folder = await Folder.findOne({ _id: req.params.id, userId: req.user.id });
  if (!folder) {
    return res.status(404).json({ message: "Folder not found" });
  }
  res.json(folder);
});

router.patch("/:id", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Folder name is required" });
  }

  const folder = await Folder.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { name },
    { new: true }
  );

  if (!folder) {
    return res.status(404).json({ message: "Folder not found" });
  }

  res.json(folder);
});

router.delete("/:id", async (req, res) => {
  const folder = await Folder.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!folder) {
    return res.status(404).json({ message: "Folder not found" });
  }

  await Feed.updateMany({ folderId: folder._id, userId: req.user.id }, { folderId: null });

  res.json({ message: "Folder deleted" });
});

export default router;
