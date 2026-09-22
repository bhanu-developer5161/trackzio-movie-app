import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `/api/movies/${id}`
        );

        setMovie(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const addToWishlist = async () => {
    if (!movie) return;

    try {
      setAdding(true);
      setMessage("");

      await axios.post(
        "/api/wishlist",
        {
          movieId: movie.id,
          title: movie.title,
          poster: movie.poster,
          rating: movie.rating,
          releaseDate: movie.releaseDate,
          overview: movie.overview,
        }
      );

      setMessage("Movie added to your wishlist!");
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage(
          "This movie is already in your wishlist."
        );
      } else {
        setMessage(
          "Unable to add movie to wishlist."
        );
      }
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="message">
        <h2>Loading movie...</h2>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="message">
        <h2>{error || "Movie not found."}</h2>

        <Link
          to="/"
          className="back-link"
        >
          ← Back to Discover
        </Link>
      </div>
    );
  }

  const posterUrl = movie.poster
    ? `https://image.tmdb.org/t/p/w500${movie.poster}`
    : "https://via.placeholder.com/300x450?text=No+Poster";

  return (
    <div>
      <nav className="navbar">
        <Link
          to="/"
          className="brand"
        >
          Trackzio Movies
        </Link>

        <div className="nav-links">
          <Link to="/">
            Discover
          </Link>

          <Link to="/wishlist">
            Wishlist
          </Link>
        </div>
      </nav>

      <main className="movie-details-container">
        <Link
          to="/"
          className="back-link"
        >
          ← Back to Discover
        </Link>

        <div className="movie-details">
          <div className="details-poster">
            <img
              src={posterUrl}
              alt={movie.title}
            />
          </div>

          <div className="details-content">
            <h1>{movie.title}</h1>

            {movie.tagline && (
              <p className="tagline">
                {movie.tagline}
              </p>
            )}

            <div className="details-meta">
              <span>
                ⭐ {movie.rating?.toFixed(1) || "N/A"}
              </span>

              <span>
                📅{" "}
                {movie.releaseDate ||
                  "Release date unavailable"}
              </span>

              {movie.runtime > 0 && (
                <span>
                  ⏱️ {movie.runtime} min
                </span>
              )}
            </div>

            {movie.genres?.length > 0 && (
              <div className="genres">
                {movie.genres.map((genre) => (
                  <span
                    className="genre"
                    key={genre}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <h2>Overview</h2>

            <p className="overview">
              {movie.overview ||
                "No overview available."}
            </p>

            <button
              className="details-wishlist-button"
              onClick={addToWishlist}
              disabled={adding}
            >
              {adding
                ? "Adding..."
                : "♡ Add to Wishlist"}
            </button>

            {message && (
              <p className="wishlist-message">
                {message}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MovieDetails;