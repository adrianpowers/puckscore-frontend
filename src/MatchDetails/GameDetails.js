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
  const [winnerConfirmationVisible, setWinnerConfirmationVisible] = useState(true);

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
      console.log("Game created successfully - congrats, ", playerId, "!")
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
      <p>
        {game.gameWinner === playerOne._id
          ? `${playerOneScore} - ${playerTwoScore} ${playerOne.name.firstName}`
          : `${playerTwoScore} - ${playerOneScore} ${playerTwo.name.firstName}`}
      </p>
    );
  } else {
    // Render the counters
    return (
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-bold">{playerOne.name.firstName}</h3>
          <button onClick={() => handleScoreChange("playerOne", "increase")}>
            +
          </button>
          <span>{playerOneScore}</span>
          <button onClick={() => handleScoreChange("playerOne", "decrease")}>
            -
          </button>
        </div>
        <div>
          <h3 className="font-bold">{playerTwo.name.firstName}</h3>
          <button onClick={() => handleScoreChange("playerTwo", "increase")}>
            +
          </button>
          <span>{playerTwoScore}</span>
          <button onClick={() => handleScoreChange("playerTwo", "decrease")}>
            -
          </button>
        </div>
        {(winnerConfirmationVisible && playerOneScore === 7) && (
          <button onClick={() => handleConfirmWinner(playerOne)}>
            Confirm {playerOne.name.firstName} as winner?
          </button>
        )}
        {(winnerConfirmationVisible && playerTwoScore === 7) && (
          <button onClick={() => handleConfirmWinner(playerTwo)}>
            Confirm {playerTwo.name.firstName} as winner?
          </button>
        )}
      </div>
    );
  }
}