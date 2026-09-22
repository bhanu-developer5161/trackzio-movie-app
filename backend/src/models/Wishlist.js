const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    movieId: {
      type: Number,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
    },

    poster: {
      type: String,
      default: null,
    },

    rating: {
      type: Number,
      default: 0,
    },

    releaseDate: {
      type: String,
      default: "",
    },

    overview: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);