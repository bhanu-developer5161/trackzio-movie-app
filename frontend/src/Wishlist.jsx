import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Wishlist() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "/api/wishlist"
      );

      setMovies(response.data);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load your wishlist."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (movieId) => {
    try {
      await axios.delete(
        `/api/wishlist/${movieId}`
      );

      setMovies((currentMovies) =>
        currentMovies.filter(
          (movie) => movie.movieId !== movieId
        )
      );
    } catch (err) {
      console.error(err);
      alert(
        "Unable to remove movie from wishlist."
      );
    }
  };

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

      <main className="container">
        <div className="wishlist-header">
          <div>
            <h1>My Wishlist</h1>

            <p>
              {movies.length}{" "}
              {movies.length === 1
                ? "movie"
                : "movies"}{" "}
              saved
            </p>
          </div>
        </div>

        {loading && (
          <div className="message">
            <h2>
              Loading wishlist...
            </h2>
          </div>
        )}

        {!loading && error && (
          <div className="message">
            <h2>{error}</h2>

            <button
              className="retry-button"
              onClick={fetchWishlist}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          movies.length === 0 && (
            <div className="message">
              <h2>
                Your wishlist is empty
              </h2>

              <p>
                Browse movies and add your
                favorites to your wishlist.
              </p>

              <Link
                to="/"
                className="browse-button"
              >
                Discover Movies
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          movies.length > 0 && (
            <div className="movie-grid">
              {movies.map((movie) => {
                const posterUrl = movie.poster
                  ? `https://image.tmdb.org/t/p/w500${movie.poster}`
                  : "https://via.placeholder.com/300x450?text=No+Poster";

                return (
                  <div
                    className="movie-card"
                    key={movie.movieId}
                  >
                    <Link
                      to={`/movie/${movie.movieId}`}
                    >
                      <img
                        src={posterUrl}
                        alt={movie.title}
                        loading="lazy"
                      />
                    </Link>

                    <div className="movie-info">
                      <Link
                        to={`/movie/${movie.movieId}`}
                        className="movie-title"
                      >
                        {movie.title}
                      </Link>

                      <p>
                        ⭐{" "}
                        {movie.rating?.toFixed(
                          1
                        ) || "N/A"}
                      </p>

                      <p>
                        {movie.releaseDate ||
                          "Release date unavailable"}
                      </p>

                      <button
                        className="remove-button"
                        onClick={() =>
                          removeFromWishlist(
                            movie.movieId
                          )
                        }
                      >
                        Remove from Wishlist
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </main>
    </div>
  );
}

export default Wishlist;