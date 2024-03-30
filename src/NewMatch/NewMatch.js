import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewMatchForm from "./NewMatchForm"; 
import { createMatch, generateUniqueId, searchPlayersByName } from "../utils/api";
import "../index.css";

export default function NewMatch() {
  const navigate = useNavigate();

  const initialFormState = {
    challenger_name: "",
    challenged_name: "",
    challenger_state_rank: 0,
    challenged_state_rank: 0,
    challenger_world_rank: 0,
    challenged_world_rank: 0,
    sets_to_win: "1",
    total_sets: "1",
    id: 0,
  };

  const [formData, setFormData] = useState({ ...initialFormState });  
  const [challengerSearchResults, setChallengerSearchResults] = useState([]);
  const [challengedSearchResults, setChallengedSearchResults] = useState([]);
  // const [errors, setErrors] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "sets_to_win") {
      const totalSets =
        value === "1" ? 1 : value * 2 - 1;
      setFormData({
        ...formData,
        sets_to_win: parseInt(value),
        total_sets: totalSets,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if(name === "challenger_name"){
      searchPlayers(value, setChallengerSearchResults)
    } else if(name === "challenged_name") {
      searchPlayers(value, setChallengedSearchResults)
    }
  };

  const handlePlayerSelect = (playerName, playerStateRank, playerWorldRank, isChallenger) => {
    if (isChallenger) {
      setFormData({
        ...formData,
        challenger_name: playerName,
        challenger_state_rank: playerStateRank,
        challenger_world_rank: playerWorldRank,
      });
      setChallengerSearchResults([]);
    } else {
      setFormData({
        ...formData,
        challenged_name: playerName,
        challenged_state_rank: playerStateRank,
        challenged_world_rank: playerWorldRank,
      });
      setChallengedSearchResults([]); 
    }
  };

  const searchPlayers = (searchQuery, setSearchResults) => {
    searchPlayersByName(searchQuery)
      .then((results) => {
        setSearchResults(results);
      })
      .catch((error) => {
        console.error("Error searching players:", error);
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // const ac = new AbortController();

    // Generate a unique ID for the match
    const matchId = generateUniqueId();

    // Use the match ID in the URL path
    navigate(`/matches/${matchId}`);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-primary-blue">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl text-white font-bold mb-10 text-center">
          New Match
        </h1>
        <NewMatchForm
          newMatch={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handlePlayerSelect={handlePlayerSelect}
          searchPlayers={searchPlayers}
          challengerSearchResults={challengerSearchResults}
          challengedSearchResults={challengedSearchResults}
        />
      </div>
    </div>
  );
}
