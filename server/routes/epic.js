const express = require("express");
const router = express.Router();
const { EpicFreeGames } = require("epic-free-games");

router.get("/free", async (req, res) => {
  try {
    const epic = new EpicFreeGames({
      country: "US",
      locale: "en-US",
      includeAll: true 
    });

    const games = await epic.getGames();

    const currentGames = games.currentGames || [];

    res.json(currentGames);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Epic Free Games data" });
  }
});

module.exports = router;
