const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const gamesRouter = require("./routes/games");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
// Games.js
app.use("/api/games", gamesRouter);

//Favorites
const favoriteRoutes = require("./routes/favorites");
app.use("/api/favorites", require("./routes/favorites"));



// Default route
app.get("/", (req, res) => {
  res.send("🎮 Game Price Tracker API is running...");
});



// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));





