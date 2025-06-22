import React, { useEffect, useState, useRef } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import { FaGamepad } from "react-icons/fa";
import "./HomePage.css";

export default function HomePage() {
  const [epic, setEpic] = useState([]);
  const [newest, setNewest] = useState([]);
  const [trending, setTrending] = useState([]);
  const navigate = useNavigate();

  const newestRef = useRef(null); // new ref for newest horizontal scroll

  useEffect(() => {
    axios.get("/epic/free").then(res => setEpic(res.data));
    axios.get("/games/free?sort=release-date").then(res => setNewest(res.data.slice(0, 10)));
    axios.get("/games/free?sort=popularity").then(res => setTrending(res.data.slice(0, 10)));
  }, []);

  const scrollLeft = () => {
    newestRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    newestRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="home-container">
      
      <h1 className="main-title brand-gamix">
      <FaGamepad className="gamix-icon" />
      <span>
        <span className="gam">Gam</span><span className="ix">ix</span>
      </span>
    </h1>

    <p className="brand-description">
      Gamix is your ultimate destination to explore, track, and collect free and paid games from top platforms. 
      Discover the latest releases, compare game prices, set deal alerts, and build your personal game collection.
    </p>

      {/* Epic Free Games Section */}
      <div className="section">
        <div className="section-header">
          <h2>🎁 Epic Games Platform's This Week Free Games</h2>
        </div>

        <p className="section-description">
        Discover this week's free games available on the Epic Games Store. Grab limited-time giveaways before they're gone—no payment required!
      </p>


        <div className="epic-hero-container">
          {epic.map(game => {
            const banner = game.keyImages.find(img => img.type === "OfferImageWide") 
                        || game.keyImages.find(img => img.type === "Thumbnail");

            const startDate = game.promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0]?.startDate;
            const endDate = game.promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0]?.endDate;

            return (
              <div key={game.id} className="epic-hero-card" onClick={() => window.open(game.catalogNs.mappings[0].pageSlug ? `https://store.epicgames.com/en-US/p/${game.catalogNs.mappings[0].pageSlug}` : '#')}>
                <div className="epic-hero-image-container">
                  <img src={banner ? banner.url : ""} alt={game.title} className="epic-hero-image" />
                </div>
                <div className="epic-hero-overlay">
                  <div className="epic-hero-info">
                    <h2>{game.title}</h2>
                    <p>{game.description}</p>
                  </div>
                  <div className="epic-hero-button">
                    <button className="claim-button">Free Until {endDate?.substring(0, 10)}</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>



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
