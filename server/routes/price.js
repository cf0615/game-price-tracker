const express = require("express");
const axios = require("axios");
const router = express.Router();

// 🔍 Search for deals by title
router.get("/search", async (req, res) => {
  const { title } = req.query;
  if (!title) return res.status(400).json({ error: "Missing title" });

  try {
    const dealRes = await axios.get(
      `https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(title)}&pageSize=60`
    );

    // Group deals by gameID
    const grouped = {};
    dealRes.data.forEach(deal => {
      if (!grouped[deal.gameID]) grouped[deal.gameID] = [];
      grouped[deal.gameID].push(deal);
    });

    res.json(grouped);
  } catch (err) {
    console.error("Failed to fetch deals", err.message);
    res.status(500).json({ error: "Failed to fetch deals" });
  }
});

// 🏪 Get all store info
router.get("/stores", async (req, res) => {
  try {
    const storeRes = await axios.get("https://www.cheapshark.com/api/1.0/stores");
    const mapped = {};
    storeRes.data.forEach(store => {
      mapped[store.storeID] = {
        name: store.storeName,
        icon: `https://www.cheapshark.com${store.images.icon}`,
      };
    });
    res.json(mapped);
  } catch (err) {
    console.error("Failed to fetch stores", err.message);
    res.status(500).json({ error: "Failed to fetch stores" });
  }
});

// 💰 Get cheapest ever price using Steam App ID
router.get("/cheapest/:steamAppID", async (req, res) => {
  const { steamAppID } = req.params;
  try {
    const gameRes = await axios.get(`https://www.cheapshark.com/api/1.0/games?steamAppID=${steamAppID}`);
    const game = gameRes.data?.[0];
    if (!game) return res.status(404).json({ error: "No game found for given Steam App ID" });

    res.json({ cheapest: game.cheapest });
  } catch (err) {
    console.error("Failed to fetch cheapest price", err.message);
    res.status(500).json({ error: "Failed to fetch cheapest price" });
  }
});

module.exports = router;
