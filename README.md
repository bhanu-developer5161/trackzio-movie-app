@'
# Trackzio Movie Discovery App

A full-stack movie discovery web application built as part of the Trackzio Fullstack Developer Intern assignment.

The application allows users to discover popular movies, explore movies by genre, search for movies, sort results, view movie details, and maintain a persistent wishlist.

---

## Features

### Movie Discovery

- Browse popular movies without searching first
- Explore movies by genre
- Search for movies
- Sort movies by rating, title, and release date
- Load more movies using pagination
- Continue exploring large result sets

### Movie Details

Each movie has a dedicated details page containing:

- Movie title
- Poster
- Rating
- Release date
- Runtime
- Genres
- Tagline
- Overview
- Wishlist action

### Wishlist

Users can:

- Add movies to their wishlist
- Remove movies from their wishlist
- View saved movies
- Keep wishlist data after closing and reopening the application

Wishlist data is persisted in MongoDB.

### User Experience

The application includes:

- Loading states
- No-results states
- Error messages
- Retry actions
- Missing poster fallback
- Responsive layout
- Lazy-loaded poster images
- Navigation between Discover, Details, and Wishlist pages

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- Axios
- CORS
- dotenv

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### External API

- TMDB API

### Development Tools

- Git
- GitHub
- Visual Studio Code

---

## Architecture

The application uses a layered full-stack architecture.

```text
React Frontend
      |
      | REST API
      v
Node.js + Express
      |
      +-------------------+
      |                   |
      v                   v
TMDB Service          MongoDB
      |
      v
TMDB API