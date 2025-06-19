import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaGamepad } from "react-icons/fa"; // Font Awesome icon

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  const [hoveredTab, setHoveredTab] = useState(null);

  const isActive = (path) => location.pathname === path;

  const renderNavTab = (to, label) => {
    const isHovered = hoveredTab === label;
    const active = isActive(to);

    return (
      <Link
        to={to}
        onMouseEnter={() => setHoveredTab(label)}
        onMouseLeave={() => setHoveredTab(null)}
        style={{
          ...styles.textTab,
          color: active || isHovered ? "#00aaff" : "#ccc",
          borderBottom: active || isHovered ? "2px solid #00aaff" : "none",
        }}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.leftSection}>
        <div style={styles.brand}>
          <FaGamepad style={styles.icon} /> <span style={styles.brandText}>Gam</span><span style={styles.brandHighlight}>ix</span>
        </div>
        <div style={styles.leftLinks}>
          {renderNavTab("/games", "Game List")}
          {renderNavTab("/favorites", "Favorites")}
        </div>
      </div>

      <div style={styles.links}>
        {!isLoggedIn ? (
          <>
            {renderNavTab("/signin", "Sign In")}
            {renderNavTab("/signup", "Sign Up")}
          </>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/signin");
            }}
            style={styles.button}
          >
            Logout
          </button>
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
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  brandText: {
    color: "#fff",
  },
  brandHighlight: {
    color: "#00aaff",
  },
  icon: {
    marginRight: "8px",
    color: "#00aaff",
  },
  leftLinks: {
    display: "flex",
    gap: "2rem",
    marginLeft: "1.5rem",
  },
  links: {
    display: "flex",
    gap: "1rem",
  },
  textTab: {
    fontSize: "16px",
    textDecoration: "none",
    paddingBottom: "4px",
    transition: "color 0.3s, border-bottom 0.3s",
    fontWeight: 500,
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
