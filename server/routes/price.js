const express = require("express");
const axios = require("axios");
const router = express.Router();

// Search games
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(`https://www.nexarda.com/api/v3/search?type=games&q=${encodeURIComponent(query)}`);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch game data" });
  }
});

// Get price for a game
router.get("/price/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://www.nexarda.com/api/v3/prices?type=game&id=${id}`);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch price data" });
  }
});

module.exports = router;
