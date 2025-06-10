import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./GameDetails.css";

function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/games/${id}`)
      .then(res => setGame(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!game) return <p>Loading...</p>;

  return (
    <div className="details-container">
      <Link to="/" className="back-link">← Back to List</Link>

      <div className="details-content">
        {/* Left: Image + Buttons */}
        <div className="details-left">
          <img src={game.thumbnail} alt={game.title} className="detail-thumbnail" />
          <div className="button-row">
            <span className="tag-free">FREE</span>
            <a href={game.game_url} target="_blank" rel="noopener noreferrer">
              <button className="btn play-now">PLAY NOW ➡</button>
            </a>
            <button className="btn add-btn">ADD</button>
          </div>
        </div>

        {/* Right: Info */}
        <div className="details-right">
          <h1 className="detail-title">{game.title}</h1>
          <p className="detail-description">{game.description}</p>

          {/* Screenshot Gallery */}
          {game.screenshots && game.screenshots.length > 0 && (
            <div className="screenshot-gallery">
              {game.screenshots.map((shot) => (
                <img
                  key={shot.id}
                  src={shot.image}
                  alt={`Screenshot ${shot.id}`}
                  className="screenshot-img"
                />
              ))}
            </div>
          )}

          {/* System Requirements */}
          {game.minimum_system_requirements && (
            <div className="system-req">
              <h3>Minimum System Requirements</h3>
              <ul>
                <li><strong>OS:</strong> {game.minimum_system_requirements.os}</li>
                <li><strong>Processor:</strong> {game.minimum_system_requirements.processor}</li>
                <li><strong>Memory:</strong> {game.minimum_system_requirements.memory}</li>
                <li><strong>Graphics:</strong> {game.minimum_system_requirements.graphics}</li>
                <li><strong>Storage:</strong> {game.minimum_system_requirements.storage}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameDetails;
