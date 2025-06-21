const mongoose = require("mongoose");

const alertGameSchema = new mongoose.Schema({
  gameID: String,
  title: String,
  thumb: String,
  price: Number,
  steamAppID: String,
}, { _id: true }); // Optional: use Mongo _id for each alert

const priceAlertSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String, required: true },
  alerts: [alertGameSchema]
});

module.exports = mongoose.model("PriceAlert", priceAlertSchema);
