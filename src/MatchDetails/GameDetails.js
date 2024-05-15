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
  const [gameWinner, setGameWinner] = useState(game.gameWinner);
  const [winnerConfirmationVisible, setWinnerConfirmationVisible] =
    useState(true);

  useEffect(() => {
    setPlayerOneScore(game.playerOneScore);
    setPlayerTwoScore(game.playerTwoScore);
    setGameWinner(game.gameWinner);
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
    setGameWinner(player);
    setWinnerConfirmationVisible(false);
    onComplete(player);

    try {
      await createGame({
        matchId: matchId,
        setId: setId,
        playerOne: game.playerOne,
        playerTwo: game.playerTwo,
        playerOneScore: playerOneScore,
        playerTwoScore: playerTwoScore,
        gameWinner: player,
      });
      console.log("Game created successfully - congrats, ", gameWinner, "!")
    } catch (err) {
      console.error("Error creating game:", err);
    }
  };

  return (
    <div>
      {winnerConfirmationVisible && (
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold">{playerOne}</h3>
            <button onClick={() => handleScoreChange("playerOne", "increase")}>
              +
            </button>
            {winnerConfirmationVisible && <span>{playerOneScore}</span>}
            <button onClick={() => handleScoreChange("playerOne", "decrease")}>
              -
            </button>
          </div>
          <div>
            <h3 className="font-bold">{playerTwo}</h3>
            <button onClick={() => handleScoreChange("playerTwo", "increase")}>
              +
            </button>
            {winnerConfirmationVisible && <span>{playerTwoScore}</span>}
            <button onClick={() => handleScoreChange("playerTwo", "decrease")}>
              -
            </button>
          </div>
        </div>
      )}
      {winnerConfirmationVisible && playerOneScore === 7 && (
        <button onClick={() => handleConfirmWinner(game.playerOne)}>
          Confirm {game.playerOne} as winner?
        </button>
      )}
      {winnerConfirmationVisible && playerTwoScore === 7 && (
        <button onClick={() => handleConfirmWinner(game.playerTwo)}>
          Confirm {game.playerTwo} as winner?
        </button>
      )}
      {!winnerConfirmationVisible && gameWinner && (
        <p>
          {gameWinner === playerOne
            ? `${playerOneScore} - ${playerTwoScore} ${gameWinner}`
            : `${playerTwoScore} - ${playerOneScore} ${gameWinner}`}
        </p>
      )}
    </div>
  );
}
