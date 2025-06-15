import React, { useEffect, useState } from "react";
import axios from "../axios";
import { Link, useNavigate } from "react-router-dom";
import "./GameList.css";

function GameList() {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/games/free")
      .then(res => setGames(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSearch = () => {
    const match = games.find(game =>
      game.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (match) {
      navigate(`/games/${match.id}`);
    } else {
      alert("No game found with that name.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="game-list-page">
      {/* ✅ Page Title */}
      <div className="page-header">
        <h1>Top Free Games for PC and Browser In 2025!</h1>
        <p>{games.length} free-to-play games found in our games list!</p>

        {/* ✅ Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search game by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      {/* Game Grid */}
      <div className="game-grid">
        {games.map(game => (
          <Link to={`/games/${game.id}`} key={game.id} className="game-card-link">
            <div className="game-card">
              <div className="top-right-tags">
              <div className="free-tag">FREE</div>
              <span className="genre-tag">{game.genre}</span>
              </div>
              <img src={game.thumbnail} alt={game.title} className="game-img" />
              <div className="game-content">
                <div className="game-title-row">
                  <h3>{game.title}</h3>
                  {/* <span className="free-badge">FREE</span> */}
                </div>
                <p>{game.short_description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default GameList;
