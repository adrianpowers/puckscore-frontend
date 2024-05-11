import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewMatchForm from "./NewMatchForm";
import {
  generateUniqueId,
  searchPlayersByName,
  createMatch,
} from "../utils/api";
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
    challenger_id: "",
    challenged_id: "",
    sets_to_win: "1",
    pending_approval: true,
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
      const totalSets = value === "1" ? 1 : value * 2 - 1;
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

    if (name === "challenger_name") {
      searchPlayers(value, setChallengerSearchResults);
    } else if (name === "challenged_name") {
      searchPlayers(value, setChallengedSearchResults);
    }
  };

  const handlePlayerSelect = (
    playerFirstName,
    playerLastName,
    playerStateRank,
    playerWorldRank,
    isChallenger
  ) => {
    // Create a function to update the formData state based on the current state
    setFormData(prevFormData => {
      // Create a new object to update formData
      const updatedFormData = { ...prevFormData };
      // Update the formData based on the isChallenger flag
      if (isChallenger) {
        updatedFormData.challenger_name = `${playerFirstName} ${playerLastName}`;
        updatedFormData.challenger_state_rank = playerStateRank;
        updatedFormData.challenger_world_rank = playerWorldRank;
        // Clear the search results
        setChallengerSearchResults([]);
      } else {
        updatedFormData.challenged_name = `${playerFirstName} ${playerLastName}`;
        updatedFormData.challenged_state_rank = playerStateRank;
        updatedFormData.challenged_world_rank = playerWorldRank;
        // Clear the search results
        setChallengedSearchResults([]);
      }
      // Return the updated formData
      return updatedFormData;
    });
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
    try {
      const matchData = await createMatch(formData);
      const matchId = matchData._id;
      navigate(`/matches/id/${matchId}`);
    } catch (error) {
      // Handle error
    }
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
