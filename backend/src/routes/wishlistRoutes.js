const express = require("express");
const Wishlist = require("../models/Wishlist");

const router = express.Router();

// Get all wishlist movies
router.get("/", async (req, res) => {
  try {
    const movies = await Wishlist.find().sort({ createdAt: -1 });

    res.json(movies);
  } catch (error) {
    console.error("Wishlist fetch error:", error.message);

    res.status(500).json({
      message: "Unable to fetch wishlist",
    });
  }
});

// Add movie to wishlist
router.post("/", async (req, res) => {
  try {
    const {
      movieId,
      title,
      poster,
      rating,
      releaseDate,
      overview,
    } = req.body;

    if (!movieId || !title) {
      return res.status(400).json({
        message: "Movie ID and title are required",
      });
    }

    const existingMovie = await Wishlist.findOne({ movieId });

    if (existingMovie) {
      return res.status(409).json({
        message: "Movie already exists in wishlist",
      });
    }

    const movie = await Wishlist.create({
      movieId,
      title,
      poster,
      rating,
      releaseDate,
      overview,
    });

    res.status(201).json(movie);
  } catch (error) {
    console.error("Wishlist add error:", error.message);

    res.status(500).json({
      message: "Unable to add movie to wishlist",
    });
  }
});

// Remove movie from wishlist
router.delete("/:movieId", async (req, res) => {
  try {
    const movieId = Number(req.params.movieId);

    const deletedMovie = await Wishlist.findOneAndDelete({
      movieId,
    });

    if (!deletedMovie) {
      return res.status(404).json({
        message: "Movie not found in wishlist",
      });
    }

    res.json({
      message: "Movie removed from wishlist",
    });
  } catch (error) {
    console.error("Wishlist delete error:", error.message);

    res.status(500).json({
      message: "Unable to remove movie from wishlist",
    });
  }
});

module.exports = router;