import mongoose from "mongoose";

const feedSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Feed", feedSchema);