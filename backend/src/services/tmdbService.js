const axios = require("axios");

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Simple in-memory cache.
// Key = request + parameters
// Value = response data + expiry time
const cache = new Map();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (path, params) => {
  return `${path}:${JSON.stringify(params)}`;
};

const getCachedData = (key) => {
  const cached = cache.get(key);

  if (!cached) {
    return null;
  }

  if (Date.now() > cached.expiresAt) {
    cache.delete(key);
    return null;
  }

  return cached.data;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_DURATION,
  });
};

const tmdbRequest = async (path, params = {}) => {
  const cacheKey = getCacheKey(path, params);

  const cachedData = getCachedData(cacheKey);

  if (cachedData) {
    console.log(`TMDB cache hit: ${path}`);
    return cachedData;
  }

  console.log(`TMDB API request: ${path}`);

  const response = await axios.get(
    `${TMDB_BASE_URL}${path}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
      params,
      timeout: 10000,
    }
  );

  setCachedData(cacheKey, response.data);

  return response.data;
};

// Popular movies
const getPopularMovies = async (page = 1) => {
  return tmdbRequest("/movie/popular", {
    language: "en-US",
    page: Number(page),
  });
};

// Movies by genre
const getMoviesByGenre = async (
  genreId,
  page = 1
) => {
  return tmdbRequest("/discover/movie", {
    language: "en-US",
    page: Number(page),
    with_genres: Number(genreId),
    sort_by: "popularity.desc",
    include_adult: false,
  });
};

// Search movies
const searchMovies = async (
  query,
  page = 1
) => {
  return tmdbRequest("/search/movie", {
    query: query.trim(),
    language: "en-US",
    page: Number(page),
    include_adult: false,
  });
};

// Movie details
const getMovieDetails = async (movieId) => {
  return tmdbRequest(
    `/movie/${movieId}`,
    {
      language: "en-US",
    }
  );
};

// Movie genres
const getGenres = async () => {
  return tmdbRequest("/genre/movie/list", {
    language: "en-US",
  });
};

module.exports = {
  getPopularMovies,
  getMoviesByGenre,
  searchMovies,
  getMovieDetails,
  getGenres,
};