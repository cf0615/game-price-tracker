const express = require("express");
const axios = require("axios");
const router = express.Router();

// Enhanced free games route with filters
router.get("/free", async (req, res) => {
  try {
    const { category, sort, platform } = req.query;
    let url = "https://www.freetogame.com/api/games";

    // Build query string dynamically
    const params = new URLSearchParams();
    if (platform) params.append("platform", platform);
    if (category) params.append("category", category);
    if (sort) params.append("sort-by", sort);

    if ([...params].length > 0) {
      url += `?${params.toString()}`;
    }

    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch games" });
  }
});

// Game details (no change here)
router.get("/:id", async (req, res) => {
  const gameId = req.params.id;
  try {
    const response = await axios.get(`https://www.freetogame.com/api/game?id=${gameId}`);
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch game details" });
  }
});

module.exports = router;
