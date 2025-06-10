import React, { useEffect, useState } from "react";
import axios from "../axios";
import { Link } from "react-router-dom";
import "./GameList.css";


function GameList() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get("/games/free")
      .then(res => setGames(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="game-grid">
      {games.map(game => (
        <Link to={`/games/${game.id}`} key={game.id} className="game-card-link">
          <div className="game-card">
            <img src={game.thumbnail} alt={game.title} className="game-img" />
            <div className="game-content">
              <h3>{game.title}</h3>
              <p>{game.short_description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default GameList;
