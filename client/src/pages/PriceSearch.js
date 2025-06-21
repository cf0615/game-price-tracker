import React, { useEffect, useState } from "react";
import axios from "../axios";
import "./PriceSearch.css";

export default function PriceSearch() {
  const [query, setQuery] = useState("");
  const [groupedDeals, setGroupedDeals] = useState({});
  const [expanded, setExpanded] = useState({});
  const [storeMap, setStoreMap] = useState({});
  const [cheapestEverMap, setCheapestEverMap] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("/price/stores").then(res => setStoreMap(res.data));
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/price/search?title=${encodeURIComponent(query)}`);
      setGroupedDeals(res.data);

      const cheapestMap = {};
      await Promise.all(Object.values(res.data).map(async deals => {
        const steamAppID = deals[0]?.steamAppID;
        const gameID = deals[0]?.gameID;
        if (steamAppID) {
          const r = await axios.get(`/price/cheapest/${steamAppID}`);
          cheapestMap[gameID] = r.data.cheapest;
        }
      }));

      setCheapestEverMap(cheapestMap);
    } catch (err) {
      console.error("Search error", err);
    }
  };

  const toggleExpanded = (gameID) => {
    setExpanded(prev => ({ ...prev, [gameID]: !prev[gameID] }));
  };

  const handleSetAlert = async (gameID, title, thumb, steamAppID) => {
    if (!token) return alert("❌ Please sign in to set a price alert.");

    const userPrice = prompt("Enter your target price:");
    if (!userPrice || isNaN(userPrice)) return alert("❌ Invalid price");

    try {
      const res = await axios.post("/price/set-alert", {
        gameID,
        title,
        thumb,
        steamAppID,
        price: userPrice
      });

      if (res.data.success) {
        alert("✅ Price alert set successfully!");
      } else {
        alert("❌ Failed to set price alert.");
      }
    } catch (err) {
      console.error("Error setting alert", err);
      alert("❌ Server error. Please try again.");
    }
  };

  return (
    <div className="tracker-container">
      <h1 className="tracker-title">🎯 Game Price Search</h1>
      <p className="tracker-subtitle">
        Search for premium games and track the best prices across Steam, Epic, and more!
      </p>

      <div className="search-panel">
        <input
          type="text"
          placeholder="Search for a paid game (e.g., Elden Ring, GTA V)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>
      </div>

      {Object.keys(groupedDeals).length === 0 && (
        <p className="search-hint">
          Enter the name of a paid game above to find the best deals.
        </p>
      )}

      <div className="results-list">
        {Object.entries(groupedDeals).map(([gameID, deals]) => {
          const game = deals[0];
          const isOpen = expanded[gameID];
          const cheapestEver = cheapestEverMap[gameID];

          return (
            <div key={gameID} className="result-card">
              <img src={game.thumb} alt={game.title} className="deal-thumb" />
              <div className="details">
                <h2>{game.title}</h2>
                <p className="meta">Retail: ${parseFloat(game.normalPrice).toFixed(2)}</p>

                <div className="price-box">
                  <span className="discount">-{parseFloat(game.savings).toFixed(0)}%</span>
                  <span className="price">Now: ${parseFloat(game.salePrice).toFixed(2)}</span>
                </div>

                {cheapestEver && (
                  <p className="cheapest-ever">🏷️ Cheapest Ever: ${parseFloat(cheapestEver).toFixed(2)}</p>
                )}

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "10px" }}>
                  <button className="compare-btn" onClick={() => toggleExpanded(gameID)}>
                    {isOpen ? "Hide Stores" : "View All Deals"}
                  </button>

                  <button
                    className="alert-btn"
                    onClick={() => handleSetAlert(game.gameID, game.title, game.thumb, game.steamAppID)}
                  >
                    🔔 Set Alert
                  </button>
                </div>

                {isOpen && (
                  <div className="deal-list">
                    {deals.map(deal => {
                      const store = storeMap[deal.storeID];
                      return (
                        <div key={deal.dealID} className="deal-entry">
                          {store && (
                            <>
                              <img src={store.icon} alt={store.name} title={store.name} className="store-icon" />
                              <span className="store-name">{store.name}</span>
                            </>
                          )}
                          <span className="deal-price">${parseFloat(deal.salePrice).toFixed(2)}</span>
                          <a
                            className="buy-btn"
                            href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Buy
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
