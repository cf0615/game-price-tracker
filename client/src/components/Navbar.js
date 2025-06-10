// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>🎮 Game Tracker</div>
      <div style={styles.links}>
        {!isLoggedIn ? (
          <>
            <Link to="/signin" style={styles.link}>Sign In</Link>
            <Link to="/signup" style={styles.link}>Sign Up</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={styles.button}>Logout</button>
        )}
      </div>
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
  }
};
