// Article routes
import express from "express";
import Article from "../models/Article.js";
import { buildIndex, searchArticles } from "../services/search.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const {
    page,
    limit,
    bookmarked,
    read,
    folderId,
    startDate,
    endDate,
  } = req.query;

  const filters = {};
  if (req.user?.id) {
    filters.userId = req.user.id;
  }

  if (bookmarked !== undefined) {
    filters.bookmarked = bookmarked === "true";
  }

  if (read !== undefined) {
    filters.read = read === "true";
  }

  if (folderId) {
    filters.folderId = folderId;
  }

  if (startDate || endDate) {
    filters.publishedAt = {};
    if (startDate) filters.publishedAt.$gte = new Date(startDate);
    if (endDate) filters.publishedAt.$lte = new Date(endDate);
  }

  const query = Article.find(filters).sort({ publishedAt: -1, createdAt: -1 });

  if (page || limit) {
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 20);
    const total = await Article.countDocuments(filters);
    const results = await query.skip((pageNumber - 1) * pageSize).limit(pageSize);

    return res.json({
      data: results,
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  }

  const articles = await query;
  res.json(articles);
});

router.get("/bookmarked", authMiddleware, async (req, res) => {
  const articles = await Article.find({ userId: req.user.id, bookmarked: true }).sort({ publishedAt: -1, createdAt: -1 });
  res.json(articles);
});

router.get("/unread", authMiddleware, async (req, res) => {
  const articles = await Article.find({ userId: req.user.id, read: false }).sort({ publishedAt: -1, createdAt: -1 });
  res.json(articles);
});

router.get("/search", async (req, res) => {
  const queryText = (req.query.q || "").trim();
  if (!queryText) {
    return res.status(400).json({ message: "Query parameter 'q' is required." });
  }

  const filters = {};
  if (req.user?.id) {
    filters.userId = req.user.id;
  }

  const articles = await Article.find(filters);
  const docs = articles.map((article) => ({
    _id: article._id.toString(),
    title: article.title || "",
    description: article.description || "",
    content: article.content || "",
  }));

  buildIndex(docs);
  const results = searchArticles(queryText);
  const ids = results.map((result) => result.ref);
  const matched = articles.filter((article) => ids.includes(article._id.toString()));

  res.json(matched);
});

router.get("/:id", async (req, res) => {
  const filters = { _id: req.params.id };
  if (req.user?.id) filters.userId = req.user.id;

  const article = await Article.findOne(filters);
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }
  res.json(article);
});

router.patch("/:id/bookmark", authMiddleware, async (req, res) => {
  const { bookmarked } = req.body;
  if (bookmarked === undefined) {
    return res.status(400).json({ message: "Bookmark value is required" });
  }

  const article = await Article.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { bookmarked: Boolean(bookmarked) },
    { new: true }
  );

  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  res.json(article);
});

router.patch("/:id/read", authMiddleware, async (req, res) => {
  const { read } = req.body;
  if (read === undefined) {
    return res.status(400).json({ message: "Read value is required" });
  }

  const article = await Article.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { read: Boolean(read) },
    { new: true }
  );

  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  res.json(article);
});

export default router;