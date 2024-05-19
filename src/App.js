import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home.js";
import PlayerProfile from "./PlayerProfile.js";
import NewMatch from "./NewMatch/NewMatch.js";
import MatchDetails from "./MatchDetails/MatchDetails.js";
import Matches from "./Matches.js";
import Rankings from "./Rankings.js";
import "./index.css";

/**
 * Defines the root application component.
 * @returns {JSX.Element}
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="newmatch" element={<NewMatch />} />
      <Route path="matches" element={<Matches />} />
      <Route path="matches/:matchId" element={<MatchDetails />} />
      <Route path="rankings" element={<Rankings />} />
      <Route path="players/:playerId" element={<PlayerProfile />} />
    </Routes>
  );
}

export default App;
