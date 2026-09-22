import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);

  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const [sortBy, setSortBy] = useState("default");

  // Wishlist
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistLoadingId, setWishlistLoadingId] =
    useState(null);

  // Load genres
  const loadGenres = async () => {
    try {
      const response = await axios.get(
        "/api/movies/genres"
      );

      setGenres(response.data || []);
    } catch (error) {
      console.error("Genre load error:", error);
    }
  };

  // Load wishlist IDs
  const loadWishlist = async () => {
    try {
      const response = await axios.get(
        "/api/wishlist"
      );

      const ids = response.data.map(
        (movie) => movie.movieId
      );

      setWishlistIds(ids);
    } catch (error) {
      console.error("Wishlist load error:", error);
    }
  };

  // Load popular movies
  const loadPopularMovies = async (pageNumber = 1) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError("");

      const response = await axios.get(
        "/api/movies",
        {
          params: {
            page: pageNumber,
          },
        }
      );

      const newMovies = response.data.movies || [];

      if (pageNumber === 1) {
        setMovies(newMovies);
      } else {
        setMovies((previousMovies) => [
          ...previousMovies,
          ...newMovies,
        ]);
      }

      setPage(response.data.page);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load movies. Please check whether the backend is running."
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load movies by genre
  const loadGenreMovies = async (
    genreId,
    pageNumber = 1
  ) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError("");

      const response = await axios.get(
        "/api/movies",
        {
          params: {
            genre: genreId,
            page: pageNumber,
          },
        }
      );

      const newMovies = response.data.movies || [];

      if (pageNumber === 1) {
        setMovies(newMovies);
      } else {
        setMovies((previousMovies) => [
          ...previousMovies,
          ...newMovies,
        ]);
      }

      setPage(response.data.page);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load movies for this genre. Please try again."
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Search movies
  const searchMovies = async (
    query,
    pageNumber = 1
  ) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError("");

      const response = await axios.get(
        "/api/movies/search",
        {
          params: {
            q: query,
            page: pageNumber,
          },
        }
      );

      const newMovies = response.data.movies || [];

      if (pageNumber === 1) {
        setMovies(newMovies);
      } else {
        setMovies((previousMovies) => [
          ...previousMovies,
          ...newMovies,
        ]);
      }

      setPage(response.data.page);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to search movies. Please try again."
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadPopularMovies(1);
    loadGenres();
    loadWishlist();
  }, []);

  // Search
  const handleSearch = () => {
    const query = search.trim();

    if (!query) {
      setActiveSearch("");
      setSelectedGenre(null);
      setPage(1);
      setSortBy("default");

      loadPopularMovies(1);
      return;
    }

    setActiveSearch(query);
    setSelectedGenre(null);
    setPage(1);
    setSortBy("default");

    searchMovies(query, 1);
  };

  // Genre selection
  const handleGenreSelect = (genreId) => {
    setSearch("");
    setActiveSearch("");
    setSortBy("default");
    setSelectedGenre(genreId);
    setPage(1);

    loadGenreMovies(genreId, 1);
  };

  // Show all movies
  const handleAllMovies = () => {
    setSearch("");
    setActiveSearch("");
    setSelectedGenre(null);
    setSortBy("default");
    setPage(1);

    loadPopularMovies(1);
  };

  // Enter key
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Load more
  const handleLoadMore = () => {
    if (loadingMore) {
      return;
    }

    if (page >= totalPages) {
      return;
    }

    const nextPage = page + 1;

    if (activeSearch) {
      searchMovies(activeSearch, nextPage);
    } else if (selectedGenre) {
      loadGenreMovies(selectedGenre, nextPage);
    } else {
      loadPopularMovies(nextPage);
    }
  };

  // Add / remove wishlist
  const handleWishlistToggle = async (
    event,
    movie
  ) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      setWishlistLoadingId(movie.id);

      const isSaved = wishlistIds.includes(movie.id);

      if (isSaved) {
        await axios.delete(
          `/api/wishlist/${movie.id}`
        );

        setWishlistIds((currentIds) =>
          currentIds.filter(
            (id) => id !== movie.id
          )
        );
      } else {
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

        setWishlistIds((currentIds) => [
          ...currentIds,
          movie.id,
        ]);
      }
    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );

      if (error.response?.status === 409) {
        setWishlistIds((currentIds) =>
          currentIds.includes(movie.id)
            ? currentIds
            : [...currentIds, movie.id]
        );
      } else {
        alert(
          "Unable to update wishlist. Please try again."
        );
      }
    } finally {
      setWishlistLoadingId(null);
    }
  };

  // Sort movies
  const sortedMovies = useMemo(() => {
    const sorted = [...movies];

    switch (sortBy) {
      case "rating-high":
        return sorted.sort(
          (a, b) =>
            (b.rating || 0) -
            (a.rating || 0)
        );

      case "rating-low":
        return sorted.sort(
          (a, b) =>
            (a.rating || 0) -
            (b.rating || 0)
        );

      case "title":
        return sorted.sort((a, b) =>
          a.title.localeCompare(b.title)
        );

      case "newest":
        return sorted.sort((a, b) =>
          (b.releaseDate || "").localeCompare(
            a.releaseDate || ""
          )
        );

      case "oldest":
        return sorted.sort((a, b) =>
          (a.releaseDate || "").localeCompare(
            b.releaseDate || ""
          )
        );

      default:
        return sorted;
    }
  }, [movies, sortBy]);

  // Current genre name
  const selectedGenreName =
    genres.find(
      (genre) => genre.id === selectedGenre
    )?.name || "";

  // Loading screen
  if (loading) {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="logo">
            Trackzio Movies
          </div>

          <div className="nav-links">
            <Link to="/">
              Discover
            </Link>

            <Link to="/wishlist">
              Wishlist ❤️
            </Link>
          </div>
        </nav>

        <div className="message">
          Loading movies...
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Navbar */}

      <nav className="navbar">
        <div className="logo">
          Trackzio Movies
        </div>

        <div className="nav-links">
          <Link to="/">
            Discover
          </Link>

          <Link to="/wishlist">
            Wishlist ❤️
          </Link>
        </div>
      </nav>

      {/* Main */}

      <main className="container">
        {/* Hero */}

        <section className="hero">
          <h1>
            Discover Your Next Favorite Movie
          </h1>

          <p>
            Browse popular movies, explore genres,
            or search for something specific.
          </p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search for a movie..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              onKeyDown={handleKeyDown}
            />

            <button onClick={handleSearch}>
              Search
            </button>
          </div>
        </section>

        {/* Genre Filters */}

        {genres.length > 0 && (
          <section className="genre-section">
            <div className="genre-header">
              <h2>Explore by Genre</h2>
            </div>

            <div className="genre-list">
              <button
                className={`genre-button ${
                  selectedGenre === null
                    ? "active"
                    : ""
                }`}
                onClick={handleAllMovies}
              >
                All
              </button>

              {genres.map((genre) => (
                <button
                  key={genre.id}
                  className={`genre-button ${
                    selectedGenre === genre.id
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleGenreSelect(genre.id)
                  }
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Error */}

        {error && (
          <div className="error-message">
            {error}

            <button
              onClick={() => {
                if (activeSearch) {
                  searchMovies(
                    activeSearch,
                    1
                  );
                } else if (selectedGenre) {
                  loadGenreMovies(
                    selectedGenre,
                    1
                  );
                } else {
                  loadPopularMovies(1);
                }
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Movie Section */}

        <section className="movie-section">
          <div className="section-header">
            <div>
              <h2>
                {activeSearch
                  ? `Results for "${activeSearch}"`
                  : selectedGenre
                  ? `${selectedGenreName} Movies`
                  : "Popular Movies"}
              </h2>

              <span>
                {movies.length} movies loaded
              </span>
            </div>

            {/* Sort */}

            <div className="sort-container">
              <label htmlFor="sort">
                Sort by:
              </label>

              <select
                id="sort"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value
                  )
                }
              >
                <option value="default">
                  Default
                </option>

                <option value="rating-high">
                  Rating: High to Low
                </option>

                <option value="rating-low">
                  Rating: Low to High
                </option>

                <option value="title">
                  Title: A-Z
                </option>

                <option value="newest">
                  Release: Newest
                </option>

                <option value="oldest">
                  Release: Oldest
                </option>
              </select>
            </div>
          </div>

          {/* No results */}

          {movies.length === 0 && !error && (
            <div className="message">
              No movies found.
            </div>
          )}

          {/* Movie Grid */}

          <div className="movie-grid">
            {sortedMovies.map((movie) => {
              const isSaved =
                wishlistIds.includes(movie.id);

              const isUpdating =
                wishlistLoadingId === movie.id;

              return (
                <Link
                  to={`/movie/${movie.id}`}
                  className="movie-card"
                  key={movie.id}
                >
                  <div className="poster-wrapper">
                    {movie.poster ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                        alt={movie.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="poster-placeholder">
                        No Poster
                      </div>
                    )}

                    <button
                      className={`wishlist-button ${
                        isSaved
                          ? "saved"
                          : ""
                      }`}
                      onClick={(event) =>
                        handleWishlistToggle(
                          event,
                          movie
                        )
                      }
                      disabled={isUpdating}
                      aria-label={
                        isSaved
                          ? `Remove ${movie.title} from wishlist`
                          : `Add ${movie.title} to wishlist`
                      }
                    >
                      {isUpdating
                        ? "..."
                        : isSaved
                        ? "♥"
                        : "♡"}
                    </button>
                  </div>

                  <div className="movie-info">
                    <h3>
                      {movie.title}
                    </h3>

                    <div className="movie-meta">
                      <span>
                        {movie.releaseDate
                          ? movie.releaseDate.substring(
                              0,
                              4
                            )
                          : "N/A"}
                      </span>

                      <span>
                        ⭐{" "}
                        {movie.rating
                          ? movie.rating.toFixed(
                              1
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Load More */}

          {page < totalPages && (
            <div className="load-more-container">
              <button
                className="load-more-button"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore
                  ? "Loading..."
                  : "Load More Movies"}
              </button>
            </div>
          )}

          {/* End */}

          {page >= totalPages &&
            movies.length > 0 && (
              <div className="end-message">
                You have reached the end of the results.
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default App;