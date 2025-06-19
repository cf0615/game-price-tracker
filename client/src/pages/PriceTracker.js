import React, { useState } from "react";
import axios from "../axios";
import "./PriceTracker.css";

export default function PriceTracker() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [priceData, setPriceData] = useState(null);

  const handleSearch = async () => {
    if (!query) return;
    try {
      const res = await axios.get(`/price/search?query=${query}`);
      const items = res.data.results?.items || [];
      setResults(items);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPrices = async (gameId) => {
    try {
      const res = await axios.get(`/price/price/${gameId}`);
      setPriceData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="tracker-container">
      <h1 className="tracker-title">🎯 Game Price Tracker</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search game..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="results-list">
        {results.map((game) => (
          <div className="game-card" key={game.game_info.id}>
            <img src={game.image || game.game_info.image || game.image_url} alt={game.game_info.name} />
            <div className="game-info">
              <h2>{game.game_info.name}</h2>
              <p>{game.game_info.short_desc}</p>
              <button className="price-btn" onClick={() => fetchPrices(game.game_info.id)}>
                Check Prices
              </button>
            </div>
          </div>
        ))}
      </div>

      {priceData && (
        <div className="price-popup">
          <h2>{priceData.info.name}</h2>
          <p>Available Offers:</p>
          <div className="price-list">
            {priceData.prices.list.map((offer, idx) => (
              <div key={idx} className="price-item">
                <img src={offer.store.image} alt={offer.store.name} className="store-logo" />
                <span>{offer.store.name}</span>
                <span>{offer.region}</span>
                <span>{offer.price > 0 ? `$${offer.price.toFixed(2)}` : "Unavailable"}</span>
                <a href={offer.url} target="_blank" rel="noreferrer">
                  Go to Store
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
