// Ollama service placeholder (local LLM calls)
// Implementation intentionally omitted per user request
import axios from "axios";

const OLLAMA_MODEL = process.env.OLLA_MODEL || "mistral:latest";

export const generateSummary = async ({ text, url }) => {
  const prompt = text
    ? `Summarize the following text:\n${text}`
    : `Summarize the following web page URL:\n${url}`;

  const res = await axios.post("http://localhost:11434/api/generate", {
    model: OLLAMA_MODEL,
    prompt,
    stream: false
  });

  return res.data.response;
};