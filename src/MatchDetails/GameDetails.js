import React, { useState } from "react";

export default function GameDetails({ playerOne, playerTwo, game, onComplete }) {
  const [playerOneScore, setPlayerOneScore] = useState(game.playerOneScore);
  const [playerTwoScore, setPlayerTwoScore] = useState(game.playerTwoScore);
  const [winnerConfirmationVisible, setWinnerConfirmationVisible] =
    useState(true);
  const [gameWinner, setGameWinner] = useState(game.gameWinner);

  const handleScoreChange = (player, method) => {
    if (player === "playerOne") {
      if (method === "increase") {
        if (playerOneScore < 7) {
          setPlayerOneScore(playerOneScore + 1);
        }
      } else if (method === "decrease") {
        if (playerOneScore > 0) {
          setPlayerOneScore(playerOneScore - 1);
        }
      }
    } else if (player === "playerTwo") {
      if (method === "increase") {
        if (playerTwoScore < 7) {
          setPlayerTwoScore(playerTwoScore + 1);
        }
      } else if (method === "decrease") {
        if (playerTwoScore > 0) {
          setPlayerTwoScore(playerTwoScore - 1);
        }
      }
    }
  };
  
  const handleConfirmWinner = (player) => {
    console.log("handleConfirmWinner - Player:", player);
  
    setGameWinner(player);
    console.log("handleConfirmWinner - GameWinner:", gameWinner);
  
    setWinnerConfirmationVisible(false);
    console.log("handleConfirmWinner - WinnerConfirmationVisible:", winnerConfirmationVisible);
  
    onComplete(player);
    console.log("handleConfirmWinner - onComplete triggered.");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {winnerConfirmationVisible && (
          <div>
            <h3 className="font-bold">{playerOne}</h3>
            <button onClick={() => handleScoreChange("playerOne", "increase")}>
              +
            </button>
            <span>{playerOneScore}</span>
            <button onClick={() => handleScoreChange("playerOne", "decrease")}>
              -
            </button>
          </div>
        )}
        {winnerConfirmationVisible && (
          <div>
            <h3 className="font-bold">{playerTwo}</h3>
            <button onClick={() => handleScoreChange("playerTwo", "increase")}>
              +
            </button>
            <span>{playerTwoScore}</span>
            <button onClick={() => handleScoreChange("playerTwo", "decrease")}>
              -
            </button>
          </div>
        )}
      </div>
      {winnerConfirmationVisible && playerOneScore === 7 && (
        <button onClick={() => handleConfirmWinner(playerOne)}>
          Confirm {playerOne} as winner?
        </button>
      )}
      {winnerConfirmationVisible && playerTwoScore === 7 && (
        <button onClick={() => handleConfirmWinner(playerTwo)}>
          Confirm {playerTwo} as winner?
        </button>
      )}
      {gameWinner === playerOne ? (
        <p>
          {playerOneScore} - {playerTwoScore} {gameWinner}
        </p>
      ) : (
        <p>
          {playerTwoScore} - {playerOneScore} {gameWinner}
        </p>
      )}
    </div>
  );
}
