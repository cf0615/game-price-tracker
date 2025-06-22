const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/free", async (req, res) => {
  try {
    const { sort, category } = req.query;
    let url = "https://www.freetogame.com/api/games";

    const params = new URLSearchParams();
    if (sort) params.append("sort-by", sort);
    if (category) params.append("category", category);

    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch games" });
  }
});

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