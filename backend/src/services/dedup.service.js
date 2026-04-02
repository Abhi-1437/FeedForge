import Article from "../models/Article.js";
import Feed from "../models/Feed.js";

export const saveUniqueArticles = async (items, feedId) => {
  const feed = await Feed.findById(feedId);
  if (!feed) return;

  for (const item of items) {
    const guid = item.guid || item.link || item.id;
    if (!guid) continue;

    const exists = await Article.findOne({ guid, userId: feed.userId });
    if (exists) continue;

    await Article.create({
      title: item.title || item.title?.trim() || "Untitled",
      description: item.contentSnippet || item.content || "",
      content: item.content || "",
      author: item.creator || item.author || "",
      link: item.link,
      guid,
      feedId,
      folderId: feed.folderId || null,
      userId: feed.userId,
      bookmarked: false,
      read: false,
      publishedAt: item.isoDate ? new Date(item.isoDate) : item.pubDate ? new Date(item.pubDate) : undefined,
    });
  }
};