require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const movieRoutes = require("./routes/movieRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(
      "MongoDB connected successfully"
    );
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error.message
    );
  });

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Trackzio Movie API is running",
  });
});

// Movie routes
app.use("/api/movies", movieRoutes);

// Wishlist routes
app.use(
  "/api/wishlist",
  wishlistRoutes
);

// Start server
app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});