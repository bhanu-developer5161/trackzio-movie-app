import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import axios from "axios";

import App from "./App";
import MovieDetails from "./MovieDetails";
import Wishlist from "./Wishlist";

import "./index.css";

// API base URL
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/movie/:id"
          element={<MovieDetails />}
        />
        <Route
          path="/wishlist"
          element={<Wishlist />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);