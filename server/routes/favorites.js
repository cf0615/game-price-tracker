const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");

// Add game to favorites
router.post("/add", async (req, res) => {
  const { userId, username, game } = req.body;

  try {
    let userFavorites = await Favorite.findOne({ user_id: userId });

    if (!userFavorites) {
      userFavorites = new Favorite({
        user_id: userId,
        name: username,
        favorite: [game]
      });
    } else {
      const exists = userFavorites.favorite.some(f => f.gameId === game.gameId);
      if (exists) {
        return res.status(409).json({ message: "Game already in favorites" });
      }

      userFavorites.favorite.push(game);
    }

    await userFavorites.save();
    res.status(200).json({ message: "Game added to favorites" });
  } catch (err) {
    console.error("Add Favorite Error:", err);
    res.status(500).json({ message: "Failed to add favorite" });
  }
});

// Get user's favorites
router.get("/user/:userId", async (req, res) => {
  try {
    const doc = await Favorite.findOne({ user_id: req.params.userId });
    if (!doc) return res.json([]);
    res.json(doc.favorite);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
});

// DELETE /api/favorites/remove/:userId/:favoriteId
router.delete("/remove/:userId/:favoriteId", async (req, res) => {
  const { userId, favoriteId } = req.params;

  try {
    const updated = await Favorite.findOneAndUpdate(
      { user_id: userId },
      { $pull: { favorite: { _id: favoriteId } } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (err) {
    console.error("Remove error:", err);
    res.status(500).json({ message: "Failed to remove favorite" });
  }
});

module.exports = router;
