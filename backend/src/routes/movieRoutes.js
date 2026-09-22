const express = require("express");

const {
  getMovies,
  searchMovies,
  getMovieDetails,
  getGenres,
} = require("../controllers/movieController");

const router = express.Router();

// Browse popular movies or movies by genre
router.get("/", getMovies);

// Search movies
router.get("/search", searchMovies);

// Movie genres
router.get("/genres", getGenres);

// Movie details
router.get("/:id", getMovieDetails);

module.exports = router;