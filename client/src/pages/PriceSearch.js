import React, { useEffect, useState } from "react";
import axios from "../axios"; // make sure this points to your backend proxy
import "./PriceSearch.css";

export default function PriceSearch() {
  const [query, setQuery] = useState("");
  const [groupedDeals, setGroupedDeals] = useState({});
  const [expanded, setExpanded] = useState({});
  const [storeMap, setStoreMap] = useState({});
  const [cheapestEverMap, setCheapestEverMap] = useState({});

  useEffect(() => {
    // Fetch all store info from backend
    axios.get("/price/stores").then(res => setStoreMap(res.data));
  }, []);

  const handleSearch = async () => {
    try {
      // Fetch grouped deals from backend
      const res = await axios.get(`/price/search?title=${encodeURIComponent(query)}`);
      setGroupedDeals(res.data);

      // For each game, get cheapest ever via backend
      const promises = Object.values(res.data).map(async deals => {
        const steamAppID = deals[0]?.steamAppID;
        if (steamAppID) {
          const r = await axios.get(`/price/cheapest/${steamAppID}`);
          return { gameID: deals[0].gameID, cheapest: r.data.cheapest };
        }
        return { gameID: deals[0].gameID, cheapest: null };
      });

      const results = await Promise.all(promises);
      const cheapestMap = {};
      results.forEach(({ gameID, cheapest }) => {
        cheapestMap[gameID] = cheapest;
      });
      setCheapestEverMap(cheapestMap);
    } catch (err) {
      console.error("Search error", err);
    }
  };

  const toggleExpanded = (gameID) => {
    setExpanded(prev => ({ ...prev, [gameID]: !prev[gameID] }));
  };

  return (
    <div className="tracker-container">
      <h1 className="tracker-title">🎯 Game Price Search</h1>

      <div className="search-panel">
        <input
          type="text"
          placeholder="Search game..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>
      </div>

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

                <button className="compare-btn" onClick={() => toggleExpanded(gameID)}>
                  {isOpen ? "Hide Stores" : "View All Deals"}
                </button>

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
