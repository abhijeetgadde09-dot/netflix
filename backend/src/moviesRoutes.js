const express = require("express");
const authMiddleware = require("./authMiddleware");

const moviesRouter = express.Router();

const categories = [
  { key: "trending", title: "Trending Now", search: "popular" },
  { key: "action", title: "Action Movies", search: "action" },
  { key: "scifi", title: "Sci-Fi", search: "science fiction" },
  { key: "crime", title: "Crime Stories", search: "crime" },
  { key: "family", title: "Family Picks", search: "family" },
  { key: "thriller", title: "Thrillers", search: "thriller" }
];

moviesRouter.get("/catalog", authMiddleware, async (req, res) => {
  try {
    const apiKey = process.env.OMDB_API_KEY;
    const results = await Promise.all(
      categories.map(async (category) => {
        const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(category.search)}&type=movie&page=1`;
        const response = await fetch(url);
        const data = await response.json();

        return {
          key: category.key,
          title: category.title,
          items: (data.Search || [])
            .filter((m) => m.Poster && m.Poster !== "N/A")
            .slice(0, 12)
        };
      })
    );

    return res.json({ categories: results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch OMDb catalog" });
  }
});

module.exports = moviesRouter;
