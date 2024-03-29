import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home.js";
import NewMatch from "./NewMatch/NewMatch.js";
import Matches from "./Matches.js";
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
      </Routes>
  );
}

export default App;