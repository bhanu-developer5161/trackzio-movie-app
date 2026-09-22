const tmdbService = require("../services/tmdbService");

// Convert TMDB movie to the smaller object
// our frontend actually needs.
const formatMovie = (movie) => ({
  id: movie.id,
  title: movie.title,
  poster: movie.poster_path,
  rating: movie.vote_average,
  releaseDate: movie.release_date,
  overview: movie.overview,
  genreIds: movie.genre_ids || [],
});

// GET /api/movies
const getMovies = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const genre = req.query.genre;

    let data;

    if (genre) {
      data = await tmdbService.getMoviesByGenre(
        genre,
        page
      );
    } else {
      data = await tmdbService.getPopularMovies(
        page
      );
    }

    const movies = data.results.map(formatMovie);

    res.json({
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      movies,
    });
  } catch (error) {
    console.error(
      "Get movies error:",
      error.response?.data || error.message
    );

    if (error.response?.status === 429) {
      return res.status(429).json({
        message:
          "Movie service rate limit reached. Please try again shortly.",
      });
    }

    res.status(500).json({
      message: "Unable to fetch movies from TMDB",
    });
  }
};

// GET /api/movies/search
const searchMovies = async (req, res) => {
  try {
    const query = req.query.q?.trim();
    const page = Number(req.query.page) || 1;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const data =
      await tmdbService.searchMovies(
        query,
        page
      );

    const movies = data.results.map(formatMovie);

    res.json({
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      movies,
    });
  } catch (error) {
    console.error(
      "Search movies error:",
      error.response?.data || error.message
    );

    if (error.response?.status === 429) {
      return res.status(429).json({
        message:
          "Movie service rate limit reached. Please try again shortly.",
      });
    }

    res.status(500).json({
      message: "Unable to search movies",
    });
  }
};

// GET /api/movies/:id
const getMovieDetails = async (req, res) => {
  try {
    const movieId = Number(req.params.id);

    if (!Number.isInteger(movieId)) {
      return res.status(400).json({
        message: "Invalid movie ID",
      });
    }

    const movie =
      await tmdbService.getMovieDetails(
        movieId
      );

    const movieDetails = {
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path,
      backdrop: movie.backdrop_path,
      rating: movie.vote_average,
      voteCount: movie.vote_count,
      releaseDate: movie.release_date,
      runtime: movie.runtime,
      overview: movie.overview,

      genres: movie.genres
        ? movie.genres.map(
            (genre) => genre.name
          )
        : [],

      tagline: movie.tagline,
      status: movie.status,
      language: movie.original_language,
    };

    res.json(movieDetails);
  } catch (error) {
    console.error(
      "Movie details error:",
      error.response?.data || error.message
    );

    if (error.response?.status === 404) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({
        message:
          "Movie service rate limit reached. Please try again shortly.",
      });
    }

    res.status(500).json({
      message: "Unable to fetch movie details",
    });
  }
};

// GET /api/genres
const getGenres = async (req, res) => {
  try {
    const data =
      await tmdbService.getGenres();

    res.json(data.genres || []);
  } catch (error) {
    console.error(
      "Get genres error:",
      error.response?.data || error.message
    );

    if (error.response?.status === 429) {
      return res.status(429).json({
        message:
          "Movie service rate limit reached. Please try again shortly.",
      });
    }

    res.status(500).json({
      message: "Unable to fetch movie genres",
    });
  }
};

module.exports = {
  getMovies,
  searchMovies,
  getMovieDetails,
  getGenres,
};