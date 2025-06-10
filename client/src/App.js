import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Navbar from "./components/Navbar";
import GameList from "./pages/GameList";
import GameDetails from "./pages/GameDetails";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/games" element={<GameList />} />
        <Route path="/games/:id" element={<GameDetails />} />
      </Routes>
    </Router>
  );
}

export default App;