// Search service placeholder (Lunr.js)
// Implementation intentionally omitted per user request
import lunr from "lunr";

let index;

export const buildIndex = (articles) => {
  index = lunr(function () {
    this.ref("id");
    this.field("title");
    this.field("description");

    articles.forEach((doc) => {
      this.add({
        id: doc._id,
        title: doc.title,
        description: doc.description
      });
    });
  });
};

export const searchArticles = (query) => {
  return index.search(query);
};