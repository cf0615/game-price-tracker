const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/free", async (req, res) => {
  try {
    const response = await axios.get("https://www.freetogame.com/api/games");
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
