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

  const handleAddFavorite = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id || !user.username) {
      alert("Please log in first.");
      return;
    }

    axios.post("http://localhost:5000/api/favorites/add", {
      userId: user.id,
      username: user.username,
      game: {
        gameId: game.id,
        title: game.title,
        thumbnail: game.thumbnail,
        genre: game.genre,
        platform: game.platform,
        game_url: game.game_url
      }
    })
    .then(res => alert(res.data.message))
    .catch(err => {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add favorite");
    });
  };

  if (!game) return <p>Loading...</p>;

  return (
    <div className="details-container">
      <Link to="/games" className="back-button">← Back to List</Link>

      <div className="details-content">
        <div className="details-left">
          <img src={game.thumbnail} alt={game.title} className="detail-thumbnail" />
          <div className="button-row">
            <span className="tag-free">FREE</span>
            <a href={game.game_url} target="_blank" rel="noopener noreferrer">
              <button className="btn play-now">PLAY NOW ➡</button>
            </a>
            <button className="btn add-btn" onClick={handleAddFavorite}>ADD</button>
          </div>

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

          {game.screenshots?.length > 0 && (
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

      {selectedScreenshot && (
        <div className="screenshot-modal" onClick={() => setSelectedScreenshot(null)}>
          <img src={selectedScreenshot} alt="Full Screenshot" className="modal-image" />
        </div>
      )}
    </div>
  );
}

export default GameDetails;