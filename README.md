# Trackzio Movie Discovery App

A full-stack movie discovery web application built as part of the **Trackzio Fullstack Developer Intern Screening Assignment**.

The application provides a real movie-discovery experience where users can browse popular movies, explore movies by genre, search for movies, sort results, view detailed movie information, and maintain a persistent wishlist.

---

## 🚀 Live Demo

### Frontend

**https://trackzio-movie-app-seven.vercel.app/**

### Backend API

**https://trackzio-movie-backend.onrender.com/**

### GitHub Repository

**https://github.com/bhanu-developer5161/trackzio-movie-app**

### Project Documentation

[View Project Documentation](./documentation/Trackzio_Movie_Discovery_App_Documentation.pdf)

### Demo Video

**Add your Loom or Google Drive video link here after recording the final demonstration.**

---

## ✨ Features

### Movie Discovery

* Browse popular movies without searching first
* Explore movies by genre
* Search for movies
* Sort results by:

  * Rating: High to Low
  * Rating: Low to High
  * Title: A-Z
  * Release: Newest
  * Release: Oldest
* Load more movies using pagination
* Continue exploring large result sets

### Movie Details

Each movie has a dedicated details page containing:

* Movie title
* Poster
* Rating
* Release date
* Runtime
* Genres
* Tagline
* Overview
* Wishlist action

### Wishlist

Users can:

* Add movies to the wishlist
* Remove movies from the wishlist
* View saved movies
* Keep wishlist data after closing and reopening the application

Wishlist data is persisted using **MongoDB Atlas**.

### User Experience

The application includes:

* Loading states
* Empty-result states
* Error messages
* Retry actions
* Missing poster fallback
* Responsive layout
* Lazy-loaded poster images
* Navigation between Discover, Movie Details, and Wishlist
* Wishlist action feedback

---

## 🛠️ Technology Stack

### Frontend

* React
* Vite
* JavaScript
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* Axios
* CORS
* dotenv
* Mongoose

### Database

* MongoDB
* MongoDB Atlas

### External API

* TMDB API

### Deployment

* **Vercel** - React frontend
* **Render** - Node.js backend
* **MongoDB Atlas** - Wishlist persistence

### Development Tools

* Git
* GitHub
* Visual Studio Code

---

## 🏗️ Architecture

The application follows a layered full-stack architecture.

```text
                    React + Vite
                     Frontend
                        |
                        | REST API
                        v
                 Node.js + Express
                        |
              +---------+---------+
              |                   |
              v                   v
        TMDB Service          MongoDB Atlas
              |
              v
           TMDB API
```

The React frontend communicates with the Node.js backend.

The frontend does **not** communicate directly with TMDB.

The Node.js backend acts as an abstraction layer between the frontend and the external movie service.

---

## 📁 Project Structure

```text
trackzio-movie-app/
│
├── README.md
├── .gitignore
│
├── documentation/
│   └── Trackzio_Movie_Discovery_App_Documentation.pdf
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── MovieDetails.jsx
│   │   ├── Wishlist.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env.example
│   ├── package.json
│   └── ...
│
└── backend/
    ├── src/
    │   ├── controllers/
    │   │   └── movieController.js
    │   │
    │   ├── models/
    │   │   └── Wishlist.js
    │   │
    │   ├── routes/
    │   │   ├── movieRoutes.js
    │   │   └── wishlistRoutes.js
    │   │
    │   ├── services/
    │   │   └── tmdbService.js
    │   │
    │   └── server.js
    │
    ├── .gitignore
    ├── package.json
    └── ...
```

---

## 🔌 API Endpoints

### Popular Movies

```text
GET /api/movies
```

Example:

```text
GET /api/movies?page=1
```

### Movies by Genre

```text
GET /api/movies?genre=28&page=1
```

Example genre IDs:

```text
28 = Action
35 = Comedy
18 = Drama
27 = Horror
878 = Science Fiction
16 = Animation
12 = Adventure
```

### Search Movies

```text
GET /api/movies/search?q=Avatar&page=1
```

### Movie Details

```text
GET /api/movies/:id
```

Example:

```text
GET /api/movies/19995
```

### Movie Genres

```text
GET /api/movies/genres
```

### Get Wishlist

```text
GET /api/wishlist
```

### Add Movie to Wishlist

```text
POST /api/wishlist
```

### Remove Movie from Wishlist

```text
DELETE /api/wishlist/:movieId
```

---

## 🔄 Data Flow

### Movie Discovery

```text
User opens Discover
        |
        v
React Frontend
        |
        v
GET /api/movies
        |
        v
Express Route
        |
        v
Movie Controller
        |
        v
TMDB Service
        |
        +---- Cache Hit ------> Cached Data
        |
        +---- Cache Miss -----> TMDB API
                                      |
                                      v
                               Movie Data
                                      |
                                      v
                              Format Response
                                      |
                                      v
                               React UI
```

### Search

```text
User enters search query
        |
        v
React Frontend
        |
        v
GET /api/movies/search
        |
        v
Express
        |
        v
Movie Controller
        |
        v
TMDB Service
        |
        v
TMDB Search API
        |
        v
Formatted Results
        |
        v
React Movie Grid
```

### Wishlist

```text
User clicks Wishlist
        |
        v
React Frontend
        |
        v
REST API
        |
        v
Express Wishlist Route
        |
        v
Mongoose
        |
        v
MongoDB Atlas
```

---

## 💾 Wishlist Data Model

The application stores the movie information required to display and manage saved movies.

Example:

```json
{
  "movieId": 19995,
  "title": "Avatar",
  "poster": "/poster-path.jpg",
  "rating": 7.6,
  "releaseDate": "2009-12-16",
  "overview": "Movie overview"
}
```

The schema also uses timestamps.

The `movieId` field is unique to prevent duplicate wishlist entries.

---

## 🧠 Technical Decisions

### Why React?

React was selected because the application requires:

* Reusable UI
* State management
* Client-side navigation
* Responsive interfaces
* API-driven rendering

### Why Node.js + Express?

Node.js and Express provide the REST API and create an abstraction layer between the frontend and TMDB.

This keeps external movie API communication inside the backend.

### Why MongoDB?

MongoDB is used to persist wishlist data.

Its document-based structure is suitable for storing movie information required by the application.

### Why TMDB?

TMDB provides movie metadata including:

* Titles
* Posters
* Ratings
* Release dates
* Genres
* Runtime
* Taglines
* Descriptions

### Why Axios?

Axios is used for HTTP communication between the frontend, backend, and external API.

### Why React Router?

React Router provides navigation between:

* Discover
* Movie Details
* Wishlist

without requiring separate full-page applications.

---

## ⚡ Performance Considerations

### Backend Cache

The backend includes a simple in-memory cache for TMDB requests.

Repeated requests using the same endpoint and parameters can be served from the cache for five minutes.

This reduces unnecessary external API requests.

### Pagination

Movie results are loaded page by page rather than requesting an extremely large dataset at once.

### Lazy Loading

Movie poster images use lazy loading where appropriate.

### Search

Search requests occur when the user submits a query rather than sending an API request for every keystroke.

### Backend Abstraction

All TMDB communication is handled by the Node.js backend.

This centralizes:

* External API access
* Data transformation
* Caching
* Error handling

---

## 🛡️ Error Handling

The application handles:

* Backend unavailable
* External TMDB service failures
* TMDB rate limiting
* Invalid movie IDs
* Empty search results
* Missing posters
* Wishlist request failures
* Duplicate wishlist movies
* Invalid API requests

The frontend displays user-friendly feedback and retry actions.

---

## 📱 Responsive Design

The application is designed for:

* Desktop
* Tablet
* Mobile

The following areas adapt to different screen widths:

* Navigation
* Search area
* Genre controls
* Movie grid
* Movie details
* Wishlist
* Buttons and controls

---

## 👤 User Flow

```text
Discover
   |
   +---- Search
   |
   +---- Explore Genre
   |
   +---- Sort Results
   |
   +---- Load More
   |
   +---- Movie Details
             |
             +---- Add to Wishlist
                       |
                       v
                   Wishlist
                       |
                       +---- Remove Movie
```

---

## 🚀 Deployment

### Frontend - Vercel

The React/Vite frontend is deployed on Vercel.

Live URL:

https://trackzio-movie-app-seven.vercel.app/

### Backend - Render

The Node.js/Express backend is deployed on Render.

Live URL:

https://trackzio-movie-backend.onrender.com/

### Database - MongoDB Atlas

Wishlist data is persisted using MongoDB Atlas.

### External API - TMDB

TMDB provides the movie data used by the application.

---

## ⚙️ Environment Configuration

### Backend

The backend uses:

```text
TMDB_ACCESS_TOKEN
MONGODB_URI
PORT
```

Example:

```env
TMDB_ACCESS_TOKEN=your_tmdb_access_token
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### Frontend

The frontend uses:

```text
VITE_API_URL
```

Local development:

```env
VITE_API_URL=http://localhost:5000
```

Production:

```env
VITE_API_URL=https://trackzio-movie-backend.onrender.com
```

Real credentials are never committed to GitHub.

---

## 🔐 Security

Sensitive environment files are excluded from Git.

Do not commit:

```text
.env
```

Do not expose:

* TMDB access tokens
* MongoDB passwords
* MongoDB connection strings
* Other private credentials

Only placeholder values should appear in documentation.

---

## 🧪 Testing Checklist

### Discover

* [x] Popular movies load
* [x] Genre filtering works
* [x] Search works
* [x] Sorting works
* [x] Pagination / Load More works

### Movie Details

* [x] Movie details open correctly
* [x] Poster loads
* [x] Movie metadata displays correctly
* [x] Add to Wishlist works

### Wishlist

* [x] Add from Discover
* [x] Add from Movie Details
* [x] Movie appears in Wishlist
* [x] Remove movie works
* [x] Wishlist persists after refresh/reopening
* [x] Duplicate movies are prevented

### Error Handling

* [x] Empty search handled
* [x] Invalid movie ID handled
* [x] Backend failure handled
* [x] Retry action works
* [x] Missing poster handled

### Responsive Design

* [x] Desktop view tested
* [x] Tablet view tested
* [x] Mobile view tested
* [x] No major layout overflow
* [x] Movie cards remain usable on smaller screens

---

## 📝 Setup Instructions

### Prerequisites

Install:

* Node.js
* npm
* Git
* MongoDB Atlas account
* TMDB developer account
* Visual Studio Code

### Clone the Repository

```bash
git clone https://github.com/bhanu-developer5161/trackzio-movie-app.git
cd trackzio-movie-app
```

### Backend Setup

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

Add:

```env
TMDB_ACCESS_TOKEN=your_tmdb_access_token
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the Vite URL displayed in the terminal.

---

## 🤖 AI Usage

AI tools were used as development assistance during the project.

AI assistance was used for:

* Understanding API documentation
* Exploring implementation approaches
* Generating boilerplate
* Troubleshooting development issues
* Reviewing code structure
* Improving error handling
* Understanding unfamiliar technologies

The developer reviewed and adapted the generated code and made decisions regarding:

* Application architecture
* Frontend structure
* Backend structure
* API design
* Data flow
* MongoDB persistence
* Feature behavior
* Error handling
* Performance considerations

The developer is responsible for understanding the implemented code and being able to explain, debug, modify, and extend the application.

---

## 📌 Assumptions

* Movie data is provided by TMDB.
* The application does not currently require user authentication.
* Wishlist persistence is implemented using MongoDB Atlas.
* Movie metadata depends on the external TMDB service.
* Internet connectivity is required for movie discovery.
* The application was developed for the Trackzio internship screening assignment.

---

## ⚠️ Limitations

* The current cache is stored in backend memory and is cleared when the backend restarts.
* Wishlist records are not currently associated with authenticated users.
* The application depends on TMDB availability and API limits.
* Free hosting plans may introduce cold-start delays.
* Production deployment requires environment variables to be configured on the hosting platforms.

---

## 🔮 Future Improvements

Possible future improvements include:

* User authentication
* Per-user wishlists
* Persistent server-side caching
* Redis caching
* Infinite scrolling
* Advanced filtering
* Combined filters and sorting
* Personalized movie recommendations
* Wishlist categories
* Automated frontend and backend tests
* CI/CD pipeline
* Production monitoring
* Accessibility improvements
* Progressive Web App support

---

## 📚 Documentation

Detailed project documentation is included in the repository:

[Trackzio Movie Discovery App Documentation](./documentation/Trackzio_Movie_Discovery_App_Documentation.pdf)

---

## 🔗 Project Links

| Resource          | Link                                                                                |
| ----------------- | ----------------------------------------------------------------------------------- |
| Live Application  | https://trackzio-movie-app-seven.vercel.app/                                        |
| Backend API       | https://trackzio-movie-backend.onrender.com/                                        |
| GitHub Repository | https://github.com/bhanu-developer5161/trackzio-movie-app                           |
| Documentation     | [PDF Documentation](./documentation/Trackzio_Movie_Discovery_App_Documentation.pdf) |
| Demo Video        | Add your video link here                                                            |

---

## 🎬 Third-Party Data

Movie information is provided by **TMDB**.

This product uses the TMDB API but is not endorsed or certified by TMDB.

TMDB API documentation:

https://developer.themoviedb.org/docs/getting-started
