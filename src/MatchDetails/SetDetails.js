import React, { useState, useEffect } from "react";
import { listGames } from "../utils/api.js";
import GameDetails from "./GameDetails";

export default function SetDetails({
  matchId,
  setId,
  setNumber,
  playerOne,
  playerTwo,
}) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const fetchedGames = await listGames(matchId, setId);
        setGames(fetchedGames || []);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, [matchId, setId]);

  const handleAddGame = () => {
    const newGame = {
      playerOne: playerOne,
      playerTwo: playerTwo,
      playerOneScore: 0,
      playerTwoScore: 0,
      gameWinner: null,
    };
    setGames([...games, newGame]);
  };

  const handleGameComplete = (index, winner) => {
    const updatedGames = [...games];
    updatedGames[index].gameWinner = winner;
    setGames(updatedGames);
  };

  return (
    <section className="flex flex-col">
      <div className="bg-secondary-blue text-center text-white text-2xl p-5 mx-6">
        <h1>SET {setNumber}</h1>
      </div>

      {games.length === 0 ? (
        <></>
      ) : (
        games.map((game, index) => (
          <GameDetails
            key={index}
            game={game}
            matchId={matchId}
            setId={setId}
            playerOne={playerOne}
            playerTwo={playerTwo}
            onComplete={(winner) => handleGameComplete(index, winner)}
          />
        ))
      )}

      <button
        className="bg-primary-red text-white px-5 py-2 mx-6 mb-5"
        onClick={handleAddGame}
      >
        Add Game
      </button>
    </section>
  );
}
