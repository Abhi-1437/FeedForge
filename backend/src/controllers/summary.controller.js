// Summary controller placeholder
// Implementation intentionally omitted per user request
import { generateSummary } from "../services/ollama.service.js";

export const getSummary = async (req, res) => {
  try {
    const { text, url } = req.body;
    if (!text && !url) {
      return res.status(400).json({ msg: "Request must include text or url to summarize" });
    }

    const summary = await generateSummary({ text, url });

    res.json({ summary });
  } catch (err) {
    console.error("Summary generation error:", err.response?.data || err.message || err);
    res.status(500).json({ msg: "Error generating summary", error: err.response?.data || err.message || "Unknown error" });
  }
};