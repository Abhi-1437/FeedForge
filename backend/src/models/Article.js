import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  author: String,
  link: String,
  guid: String,
  feedId: { type: mongoose.Schema.Types.ObjectId, ref: "Feed", required: true },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookmarked: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

articleSchema.index({ guid: 1, userId: 1 }, { unique: true, sparse: true });

export default mongoose.model("Article", articleSchema);