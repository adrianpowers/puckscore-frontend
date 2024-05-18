import React, { useState, useEffect } from "react";
import { createGame } from "../utils/api.js";

export default function GameDetails({
  game,
  matchId,
  setId,
  playerOne,
  playerTwo,
  onComplete,
}) {
  const [playerOneScore, setPlayerOneScore] = useState(game.playerOneScore);
  const [playerTwoScore, setPlayerTwoScore] = useState(game.playerTwoScore);
  const [gameWinner, setGameWinner] = useState(null);
  const [winnerConfirmationVisible, setWinnerConfirmationVisible] =
    useState(true);

  useEffect(() => {
    setPlayerOneScore(game.playerOneScore);
    setPlayerTwoScore(game.playerTwoScore);
  }, [game]);

  const handleScoreChange = (player, method) => {
    if (method === "increase") {
      if (player === "playerOne" && playerOneScore < 7) {
        setPlayerOneScore(playerOneScore + 1);
      } else if (player === "playerTwo" && playerTwoScore < 7) {
        setPlayerTwoScore(playerTwoScore + 1);
      }
    } else if (method === "decrease") {
      if (player === "playerOne" && playerOneScore > 0) {
        setPlayerOneScore(playerOneScore - 1);
      } else if (player === "playerTwo" && playerTwoScore > 0) {
        setPlayerTwoScore(playerTwoScore - 1);
      }
    }
  };

  const handleConfirmWinner = async (player) => {
    const playerId = player._id;
    setGameWinner(playerId);
    setWinnerConfirmationVisible(false);
    onComplete(playerId);

    try {
      await createGame({
        matchId: matchId,
        setId: setId,
        playerOne: game.playerOne,
        playerTwo: game.playerTwo,
        playerOneScore: playerOneScore,
        playerTwoScore: playerTwoScore,
        gameWinner: playerId,
      });
      console.log("Game created successfully - congrats, ", playerId, "!");
    } catch (err) {
      console.error("Error creating game:", err);
    }
  };

  if (!playerOne || !playerTwo) {
    return "Loading..."; // Or any other loading indicator
  }

  if (game.gameWinner) {
    // Render the completed game
    return (
      <p className="bg-primary-blue text-white text-xl text-center border-t-2 border-secondary-blue lg:w-[75%] lg:self-center ">
        {game.gameWinner === playerOne._id 
          ? `${playerOneScore} - ${playerTwoScore} ${playerOne.name.firstName}`
          : `${playerTwoScore} - ${playerOneScore} ${playerTwo.name.firstName}`}
      </p>
    );
  } else {
    // Render the counters
    return (
      <div className="w-full self-center text-center lg:w-[75%]">
        <div className="flex flex-col md:flex-row">
          <div
            id="playerOneCounter"
            className="bg-primary-yellow w-full md:w-1/2 border-t-2 border-secondary-blue"
          >
            <h3 className="font-bold text-2xl mt-2">
              {playerOne.name.firstName}
            </h3>
            <div className="flex justify-center p-2">
              <button
                className="font-bold text-2xl border-secondary-blue border-2 p-4 md:p-6 w-[30%] md:w-auto"
                onClick={() => handleScoreChange("playerOne", "increase")}
              >
                +
              </button>
              <span className="font-bold text-2xl w-[40%] md:w-auto pt-4 md:pt-6 md:mx-6">
                {playerOneScore}
              </span>
              <button
                className="font-bold text-2xl border-secondary-blue border-2 p-4 md:p-6 w-[30%] md:w-auto"
                onClick={() => handleScoreChange("playerOne", "decrease")}
              >
                -
              </button>
            </div>
          </div>
          <div
            id="playerTwoCounter"
            className="bg-primary-red w-full md:w-1/2 border-t-2 border-secondary-blue"
          >
            <h3 className="font-bold text-2xl mt-2">
              {playerTwo.name.firstName}
            </h3>
            <div className="flex justify-center p-2">
              <button
                className="font-bold text-2xl border-secondary-blue border-2 p-4 md:p-6 w-[30%] md:w-auto"
                onClick={() => handleScoreChange("playerTwo", "increase")}
              >
                +
              </button>
              <span className="font-bold text-2xl w-[40%] md:w-auto pt-4 md:pt-6 md:mx-6">
                {playerTwoScore}
              </span>
              <button
                className="font-bold text-2xl border-secondary-blue border-2 p-4 md:p-6 w-[30%] md:w-auto"
                onClick={() => handleScoreChange("playerTwo", "decrease")}
              >
                -
              </button>
            </div>
          </div>
        </div>
        {winnerConfirmationVisible && playerOneScore === 7 && (
          <button className="w-full lg:w-[75%] p-2 bg-primary-yellow text-black font-bold text-xl text-center border-t-2 border-secondary-blue" onClick={() => handleConfirmWinner(playerOne)}>
            Confirm {playerOne.name.firstName} as winner?
          </button>
        )}
        {winnerConfirmationVisible && playerTwoScore === 7 && (
          <button className="w-full lg:w-[75%] p-2 bg-primary-yellow text-black font-bold text-xl text-center border-t-2 border-secondary-blue" onClick={() => handleConfirmWinner(playerTwo)}>
            Confirm {playerTwo.name.firstName} as winner?
          </button>
        )}
      </div>
    );
  }
}
