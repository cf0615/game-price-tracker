import React, { useEffect, useState } from "react";
import axios from "../axios";
import "./Favorites.css"; // reuse styles
import { Link } from "react-router-dom";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user?._id || user?.id) {
      axios.get("/price/my-alerts", {
        headers: { "x-auth-token": token }
      })
      .then(res => setAlerts(res.data.alerts || []))
      .catch(err => console.error("Error loading alerts:", err));
    }
  }, []);

  const handleRemove = async (gameID, title) => {
    if (!window.confirm(`Remove price alert for "${title}"?`)) return;

    try {
      await axios.delete(`/price/remove-alert/${gameID}`, {
        headers: { "x-auth-token": token }
      });
      setAlerts(prev => prev.filter(alert => alert.gameID !== gameID));
    } catch (err) {
      console.error(err);
      alert("Failed to remove alert");
    }
  };

  const handleEdit = async (gameID, currentPrice, title) => {
    const newPrice = prompt(`Set new price for "${title}"`, currentPrice);
    if (!newPrice || isNaN(newPrice)) return alert("Invalid price");

    try {
      await axios.put(`/price/update-alert/${gameID}`, {
        newPrice
      }, {
        headers: { "x-auth-token": token }
      });

      setAlerts(prev =>
        prev.map(alert =>
          alert.gameID === gameID ? { ...alert, price: newPrice } : alert
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update alert");
    }
  };

  return (
    <div className="favorites-page">
      <h2 className="favorites-title">🔔 My Price Alerts</h2>
      {alerts.length === 0 ? (
        <p className="empty-msg">You haven’t set any alerts yet.</p>
      ) : (
        alerts.map(alert => (
          <div key={alert._id} className="favorite-card">
            <img src={alert.thumb} alt={alert.title} className="fav-img" />
            <div className="fav-info">
              <h3>{alert.title}</h3>
              <p className="fav-genre">Steam App ID: {alert.steamAppID}</p>
              <p className="fav-platform">Current Alert Price: ${alert.price}</p>
            </div>
            <button className="play-btn" onClick={() => handleEdit(alert.gameID, alert.price, alert.title)}>✏️ Edit</button>
            <button className="delete-btn" onClick={() => handleRemove(alert.gameID, alert.title)}>🗑️</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Alerts;
