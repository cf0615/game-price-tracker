import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaGamepad, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  const [hoveredTab, setHoveredTab] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || { username: "User" };

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
    setMenuOpen(false);
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.leftSection}>
        <div style={styles.brand}>
          <FaGamepad style={styles.icon} />
          <span style={styles.brandText}>Gam</span>
          <span style={styles.brandHighlight}>ix</span>
        </div>
        <div style={styles.leftLinks}>
          {renderNavTab("/", "Home")}
          {renderNavTab("/games", "Game List")}
          {renderNavTab("/price-tracker", "Price Search")}
        </div>
      </div>

      <div style={styles.links}>
        {!isLoggedIn ? (
          <>
            {renderNavTab("/signin", "Sign In")}
            {renderNavTab("/signup", "Sign Up")}
          </>
        ) : (
          <div style={styles.profileContainer}>
            <div
              style={styles.profileWrapper}
              onClick={() => setMenuOpen(!menuOpen)}
              title={user.username}
            >
              <FaUserCircle style={styles.profileIcon} />
              <span>{user.username}</span>
            </div>

            {menuOpen && (
              <div style={styles.dropdownMenu}>
                <Link
                  to="/favorites"
                  style={{
                    ...styles.dropdownItem,
                    backgroundColor: hoveredTab === "Favorites" ? "#333" : "transparent",
                    color: hoveredTab === "Favorites" ? "#00aaff" : "#fff"
                  }}
                  onMouseEnter={() => setHoveredTab("Favorites")}
                  onMouseLeave={() => setHoveredTab(null)}
                >
                  Favorites
                </Link>

                <Link
                  to="/alerts"
                  style={{
                    ...styles.dropdownItem,
                    backgroundColor: hoveredTab === "Alerts" ? "#333" : "transparent",
                    color: hoveredTab === "Alerts" ? "#00aaff" : "#fff"
                  }}
                  onMouseEnter={() => setHoveredTab("Alerts")}
                  onMouseLeave={() => setHoveredTab(null)}
                >
                  My Alerts
                </Link>

                <button
                onClick={handleLogout}
                style={{
                  ...styles.dropdownItem,
                  backgroundColor: hoveredTab === "Logout" ? "#333" : "transparent",
                  color: hoveredTab === "Logout" ? "#00aaff" : "#fff"
                }}
                onMouseEnter={() => setHoveredTab("Logout")}
                onMouseLeave={() => setHoveredTab(null)}
              >
                Logout
              </button>

              </div>
            )}
          </div>
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
    position: "relative",
    zIndex: 1000,
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
  brandText: { color: "#fff" },
  brandHighlight: { color: "#00aaff" },
  icon: { marginRight: "8px", color: "#00aaff" },
  leftLinks: {
    display: "flex",
    gap: "2rem",
    marginLeft: "1.5rem",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  textTab: {
    fontSize: "16px",
    textDecoration: "none",
    paddingBottom: "4px",
    transition: "color 0.3s, border-bottom 0.3s",
    fontWeight: 500,
  },
  profileContainer: {
    position: "relative",
  },
  profileWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    color: "#ccc",
    fontWeight: 500,
  },
  profileIcon: {
    fontSize: "1.3rem",
  },
  dropdownMenu: {
    position: "absolute",
    top: "120%",
    right: 0,
    backgroundColor: "#2b2b2b",
    borderRadius: "6px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    overflow: "hidden",
    zIndex: 1000,
    minWidth: "150px"  // ✅ Ensure enough width
  },

  dropdownItem: {
  display: "block",
  padding: "10px 16px",
  background: "none",
  color: "#fff",
  border: "none",
  width: "100%",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "14px",
  textDecoration: "none",
  whiteSpace: "nowrap",
  transition: "all 0.3s ease",
  backgroundColor: "transparent",
},

};
