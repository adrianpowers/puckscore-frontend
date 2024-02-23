import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewMatchForm from "./NewMatchForm"; // Assuming you have a separate component for the form
import { createMatch, generateUniqueId } from "../utils/api";
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
  const [errors, setErrors] = useState([]);

  const handleChange = (event) => {
    if (event.target.name === "sets_to_win") {
      const totalSets =
        event.target.value === "1" ? 1 : event.target.value * 2 - 1;
      setFormData({
        ...formData,
        sets_to_win: parseInt(event.target.value),
        total_sets: totalSets,
      });
    } else {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
      });
    }
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    const ac = new AbortController();

    // Generate a unique ID for the match
    const matchId = generateUniqueId();

    // Use the match ID in the URL path
    navigate(`/matches/${matchId}`);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-primary-blue">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl text-white font-bold mb-3 text-center">
          New Match
        </h1>
        <NewMatchForm
          newMatch={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
