import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios"; 

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  // 🔒 Commented out state for genre dropdown
  // const [genres, setGenres] = useState([]);
  // const [selectedGenre, setSelectedGenre] = useState("");

  // 🔒 Commented out genre-fetching logic
  // useEffect(() => {
  //   axios.get("/games/free")
  //     .then(res => {
  //       const uniqueGenres = [...new Set(res.data.map(game => game.genre))];
  //       setGenres(uniqueGenres);
  //     })
  //     .catch(err => console.error(err));
  // }, []);

  // 🔒 Commented out genre selection handler
  // const handleGenreSelect = () => {
  //   if (selectedGenre === "all") {
  //     navigate("/games");
  //   } else {
  //     navigate(`/games/genre/${selectedGenre}`);
  //   }
  // };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>🎮 Game Tracker</div>
      <div style={styles.links}>
        {!isLoggedIn ? (
          <>
            <Link to="/games" style={styles.link}>Game List</Link>
            <Link to="/signin" style={styles.link}>Sign In</Link>
            <Link to="/signup" style={styles.link}>Sign Up</Link>
          </>
        ) : (
          <button onClick={() => {
            localStorage.removeItem("token");
            navigate("/signin");
          }} style={styles.button}>Logout</button>
        )}
      </div>

      {/* 🔒 Commented out genre dropdown UI
      <div style={{ marginLeft: "20px" }}>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          style={styles.dropdown}
        >
          <option value="">Select Genre</option>
          <option value="all">All Games</option>
          {genres.map((genre, idx) => (
            <option key={idx} value={genre}>{genre}</option>
          ))}
        </select>
        <button onClick={handleGenreSelect} style={styles.dropdownBtn}>Go</button>
      </div>
      */}
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: "1rem 2rem",
    color: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
  },
  brand: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  links: {
    display: "flex",
    gap: "1rem",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    backgroundColor: "#333",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    transition: "background 0.3s",
  },
  button: {
    color: "#fff",
    backgroundColor: "#d32f2f",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  // Optional styling if dropdown is re-enabled later:
  dropdown: {
    padding: "6px",
    borderRadius: "4px",
    backgroundColor: "#1e1e1e",
    color: "#fff",
    border: "1px solid #444",
    marginRight: "10px",
  },
  dropdownBtn: {
    backgroundColor: "#0077cc",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "6px 12px",
    cursor: "pointer",
  }
};
