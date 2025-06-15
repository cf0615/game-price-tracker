import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./GameDetails.css";

function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [similarGames, setSimilarGames] = useState([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/games/${id}`)
      .then(res => {
        setGame(res.data);
        // Fetch similar games
        axios.get("http://localhost:5000/api/games/free")
          .then(gamesRes => {
            const filtered = gamesRes.data.filter(g =>
              g.genre === res.data.genre && g.id !== res.data.id
            ).slice(0, 3);
            setSimilarGames(filtered);
          });
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!game) return <p>Loading...</p>;

  return (
    <div className="details-container">
      <Link to="/games" className="back-button">← Back to List</Link>

      <div className="details-content">
        {/* Left Side */}
        <div className="details-left">
          <img src={game.thumbnail} alt={game.title} className="detail-thumbnail" />
          <div className="button-row">
            <span className="tag-free">FREE</span>
            <a href={game.game_url} target="_blank" rel="noopener noreferrer">
              <button className="btn play-now">PLAY NOW ➡</button>
            </a>
            <button className="btn add-btn">ADD</button>
          </div>

          {/* Similar Games */}
          {similarGames.length > 0 && (
            <div className="similar-games">
              <h3>Similar Games</h3>
              <div className="similar-games-list">
                {similarGames.map(similar => (
                  <Link to={`/games/${similar.id}`} key={similar.id} className="similar-game-card">
                    <img src={similar.thumbnail} alt={similar.title} />
                    <p>{similar.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="details-right">
          <h1 className="detail-title">{game.title}</h1>

          <p className="game-release">Release Date: {game.release_date ?? "N/A"}</p>
          

          <h2 className="section-title">About</h2>
          <p className="detail-description">{game.description}</p>

          <h2 className="section-title">Additional Information</h2>
          <div className="info-grid">
            <div className="info-block"><h4>Developer</h4><p>{game.developer}</p></div>
            <div className="info-block"><h4>Publisher</h4><p>{game.publisher}</p></div>
            <div className="info-block"><h4>Genre</h4><p>{game.genre}</p></div>
            <div className="info-block"><h4>Platform</h4><p>{game.platform}</p></div>
          </div>

          {game.screenshots && game.screenshots.length > 0 && (
            <>
              <h2 className="section-title">{game.title}: Screenshots</h2>
              <div className="screenshot-gallery">
                {game.screenshots.map((shot) => (
                  <img
                    key={shot.id}
                    src={shot.image}
                    alt={`Screenshot ${shot.id}`}
                    className="screenshot-img"
                    onClick={() => setSelectedScreenshot(shot.image)}
                  />
                ))}
              </div>
            </>
          )}

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

      {/* Screenshot modal */}
      {selectedScreenshot && (
        <div className="screenshot-modal" onClick={() => setSelectedScreenshot(null)}>
          <img src={selectedScreenshot} alt="Full Screenshot" className="modal-image" />
        </div>
      )}
    </div>
  );
}

export default GameDetails;
