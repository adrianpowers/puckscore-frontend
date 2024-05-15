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
    <section className="flex flex-col p-6">
      <div className="bg-primary-blue text-center text-3xl font-bold text-white w-full lg:w-[75%] self-center px-6 py-4">
        <h1>
          {`SET ${setNumber}`}
        </h1>
      </div>

      {games.length === 0 ? (
        <p className=""></p>
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
        className="bg-primary-blue text-white font-bold w-full lg:w-[75%] self-center py-2 px-6 border-t-2 border-secondary-blue"
        onClick={handleAddGame}
      >
        Add Game
      </button>
    </section>
  );
}
