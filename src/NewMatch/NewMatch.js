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
    playerOne_name: "",
    playerTwo_name: "",
    playerOne_state_rank: 0,
    playerTwo_state_rank: 0,
    playerOne_world_rank: 0,
    playerTwo_world_rank: 0,
    playerOne_id: "",
    playerTwo_id: "",
    sets_to_win: "1",
    pending_approval: true,
    total_sets: "1",
    id: 0,
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [playerOneSearchResults, setPlayerOneSearchResults] = useState([]);
  const [playerTwoSearchResults, setPlayerTwoSearchResults] = useState([]);

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

    if (name === "playerOne_name") {
      searchPlayers(value, setPlayerOneSearchResults);
    } else if (name === "playerTwo_name") {
      searchPlayers(value, setPlayerTwoSearchResults);
    }
  };

  const handlePlayerSelect = (
    playerFirstName,
    playerLastName,
    playerStateRank,
    playerWorldRank,
    isPlayerOne
  ) => {
    // Create a function to update the formData state based on the current state
    setFormData((prevFormData) => {
      // Create a new object to update formData
      const updatedFormData = { ...prevFormData };
      // Update the formData based on the isPlayerOne flag
      if (isPlayerOne) {
        updatedFormData.playerOne_name = `${playerFirstName} ${playerLastName}`;
        updatedFormData.playerOne_state_rank = playerStateRank;
        updatedFormData.playerOne_world_rank = playerWorldRank;
        // Clear the search results
        setPlayerOneSearchResults([]);
      } else {
        updatedFormData.playerTwo_name = `${playerFirstName} ${playerLastName}`;
        updatedFormData.playerTwo_state_rank = playerStateRank;
        updatedFormData.playerTwo_world_rank = playerWorldRank;
        // Clear the search results
        setPlayerTwoSearchResults([]);
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
      navigate(`/matches/${matchId}`);
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-secondary-blue">
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
          playerOneSearchResults={playerOneSearchResults}
          playerTwoSearchResults={playerTwoSearchResults}
        />
      </div>
    </div>
  );
}
