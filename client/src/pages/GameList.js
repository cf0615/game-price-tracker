import React, { useEffect, useState } from "react";
import axios from "../axios";
import { Link } from "react-router-dom"; // ✅ Add this import
import "./GameList.css";

export default function GameList() {
  const [games, setGames] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("popularity");

  const fetchGames = () => {
    let query = `/games/free?sort=${sort}`;
    if (category) query += `&category=${category}`;

    axios.get(query)
      .then(res => setGames(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchGames();
  }, [category, sort]);

  return (
    <div className="container">
      <h1 className="page-title">🎮 Free Games</h1>

      <div className="filters">
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="popularity">Trending</option>
          <option value="release-date">Newest</option>
          <option value="alphabetical">A-Z</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Category</option>
          <option value="shooter">Shooter</option>
          <option value="mmorpg">MMORPG</option>
          <option value="racing">Racing</option>
          <option value="strategy">Strategy</option>
          <option value="sports">Sports</option>
          <option value="card">Card</option>
        </select>
      </div>

      <div className="game-grid">
        {games.map((game) => (
          <Link to={`/games/${game.id}`} key={game.id} className="game-card-link">
            <div className="game-card">
              <div className="image-container">
                <img src={game.thumbnail} alt={game.title} className="game-img" />
              </div>
              <div className="game-content">
                <h3>{game.title}</h3>
                <p>{game.short_description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
