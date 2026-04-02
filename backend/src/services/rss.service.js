// RSS service placeholder (fetch + parse)
// Implementation intentionally omitted per user request
import Parser from "rss-parser";

const parser = new Parser();

export const fetchFeed = async (url) => {
  return await parser.parseURL(url);
};