import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useParams, Link } from "react-router-dom";
import "./GameList.css";

function GenreGameList() {
  const { genreName } = useParams();
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get("/games/free")
      .then(res => {
        const filtered = res.data.filter(game => game.genre === genreName);
        setGames(filtered);
      })
      .catch(err => console.error(err));
  }, [genreName]);

  return (
    <div className="game-list-page">
      <h2 style={{ color: "#fff", paddingLeft: "20px" }}>{genreName} Games</h2>
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
    </div>
  );
}

export default GenreGameList;
