import React from "react";
import { useNavigate } from "react-router-dom";
import "./GenreDropdown.css";

const genres = [
  "MMORPG", "Shooter", "MOBA", "Anime", "Battle Royale", "Strategy",
  "Fantasy", "Sci-Fi", "Card Games", "Racing", "Fighting", "Social", "Sports"
];

function GenreDropdown() {
  const navigate = useNavigate();

  const handleSelect = (genre) => {
    navigate(`/genre/${encodeURIComponent(genre)}`);
  };

  return (
    <div className="genre-dropdown">
      <button className="dropdown-toggle">Free Games ⏷</button>
      <div className="dropdown-menu">
        {genres.map((genre, idx) => (
          <button key={idx} onClick={() => handleSelect(genre)}>
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GenreDropdown;
