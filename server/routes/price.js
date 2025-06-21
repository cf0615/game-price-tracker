const express = require("express");
const axios = require("axios");
const router = express.Router();
const PriceAlert = require("../models/PriceAlert");
const User = require("../models/User");
const auth = require("../middleware/auth");

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

// Set a price alert
router.post("/set-alert", auth, async (req, res) => {
  console.log("✅ Route hit!");
  const { gameID, price, title, thumb, steamAppID } = req.body;
  console.log(gameID, price, title, thumb, steamAppID);

  if (!gameID || !price || !title || !thumb || !steamAppID) {
    return res.status(400).json({ success: false, msg: "Missing parameters" });
  }

  if (!req.user || !req.user.email || !req.user.id) {
    return res.status(401).json({ success: false, msg: "Authentication required" });
  }

  const email = req.user.email;
  const userId = req.user.id;

  try {
    // 1. Set alert on CheapShark
    const cheapSharkRes = await axios.get("https://www.cheapshark.com/api/1.0/alerts", {
      params: {
        action: "set",
        email,
        gameID,
        price
      }
    });

    // 2. Store alert in MongoDB
    let alertDoc = await PriceAlert.findOne({ user_id: userId });

    if (!alertDoc) {
      alertDoc = new PriceAlert({
        user_id: userId,
        name: req.user.username,
        alerts: [{
          gameID,
          title,
          thumb,
          price,
          steamAppID
        }]
      });
    } else {
      const exists = alertDoc.alerts.some(a => a.gameID === gameID);
      if (!exists) {
        alertDoc.alerts.push({ gameID, title, thumb, price, steamAppID });
      }
    }

    await alertDoc.save();

    return res.json({ success: true, msg: "Alert set successfully", data: cheapSharkRes.data });

  } catch (err) {
    return res.status(500).json({ success: false, msg: "Failed to set alert", error: err.message });
  }
});

router.get("/my-alerts", auth, async (req, res) => {
  const user = await PriceAlert.findOne({ user_id: req.user.id });
  res.json(user || { alerts: [] });
});

router.delete("/remove-alert/:gameID", auth, async (req, res) => {
  const { gameID } = req.params;
  const { email } = req.user;

  try {
    await axios.get("https://www.cheapshark.com/api/1.0/alerts", {
      params: { action: "delete", email, gameID }
    });

    const doc = await PriceAlert.findOne({ user_id: req.user.id });
    if (!doc) return res.status(404).json({ msg: "No alert found" });

    doc.alerts = doc.alerts.filter(a => a.gameID !== gameID);
    await doc.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Remove alert failed:", err.message);
    res.status(500).json({ msg: "Failed to remove alert" });
  }
});

router.put("/update-alert/:gameID", auth, async (req, res) => {
  const { gameID } = req.params;
  const { newPrice } = req.body;
  const { email } = req.user;

  try {
    await axios.get("https://www.cheapshark.com/api/1.0/alerts", {
      params: { action: "set", email, gameID, price: newPrice }
    });

    const doc = await PriceAlert.findOne({ user_id: req.user.id });
    const alert = doc.alerts.find(a => a.gameID === gameID);
    if (alert) {
      alert.price = newPrice;
      await doc.save();
      res.json({ success: true });
    } else {
      res.status(404).json({ msg: "Alert not found" });
    }
  } catch (err) {
    console.error("Update alert failed:", err.message);
    res.status(500).json({ msg: "Failed to update alert" });
  }
});


module.exports = router;
