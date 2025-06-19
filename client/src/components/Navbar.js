import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="brand" onClick={() => navigate("/")}>🎮 GamePlatform</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/games">Game List</Link>
        </div>
      </div>

      <div className="navbar-right">
        {!token ? (
          <>
            <Link to="/signin" className="auth-btn">Sign In</Link>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
          </>
        ) : (
          <div className="user-profile">
            <div className="profile-pic" onClick={() => setShowMenu(!showMenu)}>
              <span>👤</span>
            </div>
            {showMenu && (
              <div className="dropdown-menu">
                <div className="dropdown-username">{username}</div>
                <div className="dropdown-item">Settings</div>
                <div className="dropdown-item">Help</div>
                <div className="dropdown-item logout" onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
