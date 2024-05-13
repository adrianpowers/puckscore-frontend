import React, { useState } from "react";
import { useParams } from "react-router-dom";
import GameDetails from "./GameDetails";
import { createGame } from "../utils/api.js"

export default function SetDetails({ matchId, setId, setNumber, playerOne, playerTwo }) {
  const [games, setGames] = useState([]);
  const [winner, setWinner] = useState(null);

  const handleAddGame = async () => {
    try {
      const newGame = {
        matchId: matchId,
        setId: setId,
        playerOne: playerOne,
        playerTwo: playerTwo,
        playerOneScore: 0,
        playerTwoScore: 0,
        gameWinner: null,
      }
      console.log(setId);
      await createGame(newGame);
      setGames([...games, newGame])
    } catch (error) {
      console.error("Error Creating Game:", error);
    }
  };

  const handleGameComplete = (index, winner) => {
    console.log("handleGameComplete - Index:", index, "Winner:", winner);
  
    const updatedGames = [...games];
    updatedGames[index].gameWinner = winner;
    console.log("handleGameComplete - Updated Games:", updatedGames);
  
    setGames(updatedGames);
    console.log("handleGameComplete - Games State after update:", games);
  }

  return (
    <section className="flex flex-col">
      {/* Header with Set Number, conditionally renders winner upon completion*/}
      <div className="bg-secondary-blue text-center text-white text-2xl p-5 mx-6">
        <h1>SET {setNumber}</h1>
      </div>

      {/* Rendering Games */}
      {games.map((game, index) => (
        <GameDetails key={index} playerOne={playerOne} playerTwo={playerTwo} game={game} onComplete={(winner) => handleGameComplete(index, winner)}/>
      ))}

      <button className="bg-primary-red text-white px-5 py-2 mx-6 mb-5" onClick={handleAddGame}>Add Game</button>
    </section>
  );
}
