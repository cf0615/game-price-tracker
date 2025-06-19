const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  gameId: Number,
  title: String,
  thumbnail: String,
  genre: String,
  platform: String,
  game_url: String
}, { _id: true }); // Let MongoDB auto-generate _id for each game

const favoriteSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String, required: true },
  favorite: [gameSchema]
});

module.exports = mongoose.model("Favorite", favoriteSchema);
