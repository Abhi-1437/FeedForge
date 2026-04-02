import cron from "node-cron";
import Feed from "../models/Feed.js";
import { fetchFeed } from "./rss.service.js";
import { saveUniqueArticles } from "./dedup.service.js";
import { logger } from "../utils/logger.js";

export const startCron = () => {
  cron.schedule("*/30 * * * *", async () => {
    logger.info({ action: "cron_poll_feeds" }, "Running feed sync cron job");

    try {
      const feeds = await Feed.find();

      for (const feed of feeds) {
        try {
          const data = await fetchFeed(feed.url);
          await saveUniqueArticles(data.items, feed._id);
          logger.info({ feed: feed.url, feedId: feed._id, userId: feed.userId }, "Feed synced");
        } catch (feedError) {
          logger.error({ feed: feed.url, error: feedError?.message || feedError }, "Failed to sync feed");
        }
      }
    } catch (err) {
      logger.error({ error: err?.message || err }, "Cron job failed");
    }
  });
};