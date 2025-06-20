import React, { useEffect, useState } from "react";
import axios from "../axios";
import "./Favorites.css";
import { Link } from "react-router-dom";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      axios.get(`/favorites/user/${user.id}`)
        .then(res => setFavorites(res.data))
        .catch(err => console.error("Error loading favorites:", err));
    }
  }, []);

  const handleRemove = (favoriteId, gameTitle) => {
  const confirmed = window.confirm(`Are you sure you want to remove "${gameTitle}" from your favorites?`);
  if (!confirmed) return;

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user?.id) return alert("User not logged in");

  axios.delete(`/favorites/remove/${user.id}/${favoriteId}`)
    .then(() => {
      setFavorites(prev => prev.filter(item => item._id !== favoriteId));
    })
    .catch(err => {
      console.error(err);
      alert("Failed to remove favorite");
    });
};

  return (
    <div className="favorites-page">
      <h2 className="favorites-title">📚 My Favorite</h2>
      {favorites.length === 0 ? (
        <p className="empty-msg">You have no favorite games yet.</p>
      ) : (
        favorites.map(fav => (
          <div key={fav._id} className="favorite-card">
            <img src={fav.thumbnail} alt={fav.title} className="fav-img" />
            <div className="fav-info">
              <h3>{fav.title}</h3>
              <p className="fav-genre">{fav.genre}</p>
              <p className="fav-platform"> {fav.platform}</p>
            </div>
            <a href={fav.game_url} target="_blank" rel="noopener noreferrer">
              <button className="play-btn">PLAY NOW ➡</button>
            </a>
            <button className="delete-btn" onClick={() => handleRemove(fav._id, fav.title)}>🗑️</button>

          </div>
        ))
      )}
    </div>
  );
}

export default Favorites;
