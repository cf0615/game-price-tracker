import React, { useEffect, useState, useRef } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [newest, setNewest] = useState([]);
  const navigate = useNavigate();

  const newestRef = useRef(null); // new ref for newest horizontal scroll

  useEffect(() => {
    axios.get("/games/free?sort=popularity").then(res => setTrending(res.data.slice(0, 10)));
    axios.get("/games/free?sort=release-date").then(res => setNewest(res.data.slice(0, 10)));
  }, []);

  const scrollLeft = () => {
    newestRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    newestRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="home-container">
      <h1 className="main-title">🎮 Game Tracker</h1>

      {/* Newest Games Section */}
      <div className="section">
        <div className="section-header">
          <h2>🆕 Newest Games</h2>
          <button className="view-all" onClick={() => navigate("/games?filter=new")}>View All</button>
        </div>

        <div className="scroll-wrapper">
          <button className="scroll-button left" onClick={scrollLeft}>◀</button>
          <div className="horizontal-scroll no-scrollbar" ref={newestRef}>
            {newest.map(game => (
              <div key={game.id} className="game-card" onClick={() => navigate(`/games/${game.id}`)}>
                <div className="game-image-container">
                  <img src={game.thumbnail} alt={game.title} />
                </div>
                <div className="game-title">{game.title}</div>
              </div>
            ))}
          </div>
          <button className="scroll-button right" onClick={scrollRight}>▶</button>
        </div>
      </div>

      {/* Trending Section */}
        <div className="section">
            <div className="section-header">
                <h2>🔥 Trending Games</h2>
                <button className="view-all" onClick={() => navigate("/games?filter=trending")}>View All</button>
            </div>
            <div className="list-layout">
                {trending.map(game => (
                <div key={game.id} className="list-card" onClick={() => navigate(`/games/${game.id}`)}>
                    <img src={game.thumbnail} alt={game.title} className="list-thumbnail" />
                    <div className="list-info">
                    <h3>{game.title}</h3>
                    <p>{game.short_description}</p>
                    <div className="tags">
                        <span className="tag">{game.genre}</span>
                    </div>
                    </div>
                    <div className="list-right">
                    <span className="platform">{game.platform}</span>
                    <span className="free-badge">FREE</span>
                    </div>
                </div>
                ))}
            </div>
        </div>


    </div>
  );
}
