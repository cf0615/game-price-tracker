import React, { useEffect, useState } from "react";
import axios from "../axios";
import { Link, useNavigate } from "react-router-dom";
import "./GameList.css";

function GameList() {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGames, setFilteredGames] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("popularity");
  const navigate = useNavigate();

  const fetchGames = () => {
    let query = `/games/free?sort=${sort}`;
    if (category) query += `&category=${category}`;

    axios.get(query)
      .then(res => setGames(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
  const fetchGames = async () => {
    try {
      let query = `/games/free?sort=${sort}`;
      if (category) query += `&category=${category}`;

      const res = await axios.get(query);

      // Extra strict filter here
      const strictFiltered = category
        ? res.data.filter(game => game.genre.toLowerCase() === category.toLowerCase())
        : res.data;

      setGames(strictFiltered);
    } catch (err) {
      console.error(err);
    }
  };

  fetchGames();
}, [category, sort]);



  const handleSearch = () => {
    const match = games.find(game =>
      game.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (match) {
      navigate(`/games/${match.id}`);
    } else {
      alert("No game found with that name.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      const filtered = games.filter(game =>
        game.title.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setFilteredGames(filtered);
    } else {
      setFilteredGames([]);
    }
  };

  const handleSelectGame = (gameId) => {
    navigate(`/games/${gameId}`);
    setSearchTerm("");
    setFilteredGames([]);
  };

  return (
    <div className="game-list-page">
      {/* ✅ Page Title */}
      <div className="page-header">
        <h1>Top Free Games for PC and Browser In 2025!</h1>
        <p>{games.length} free-to-play games found in our games list!</p>

        {/* ✅ Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search game by name..."
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSearch}>Search</button>
          {filteredGames.length > 0 && (
            <ul className="search-suggestions">
              {filteredGames.map(game => (
                <li key={game.id} onClick={() => handleSelectGame(game.id)}>
                  <img src={game.thumbnail} alt={game.title} />
                  <span>{game.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ✅ Filter Dropdowns */}
        <div className="filters">
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="popularity">Trending</option>
            <option value="release-date">Newest</option>
            <option value="alphabetical">A-Z</option>
          </select>

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Category</option>
            <option value="shooter">Shooter</option>
            <option value="mmorpg">MMORPG</option>
            <option value="racing">Racing</option>
            <option value="strategy">Strategy</option>
            <option value="sports">Sports</option>
            <option value="moba">MOBA</option>
            <option value="social">Social</option>
            <option value="fighting">Fighting</option>
          </select>
        </div>
      </div>

      {/* Game Grid */}
      <div className="game-grid">
        {games.map(game => (
          <Link to={`/games/${game.id}`} key={game.id} className="game-card-link">
            <div className="game-card">
              <div className="top-right-tags">
                <div className="free-tag">FREE</div>
                <span className="genre-tag">{game.genre}</span>
              </div>
              <img src={game.thumbnail} alt={game.title} className="game-img" />
              <div className="game-content">
                <div className="game-title-row">
                  <h3>{game.title}</h3>
                </div>
                <p>{game.short_description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default GameList;