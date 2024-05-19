import React, { useState, useEffect, useRef } from "react";
import { listGames } from "../utils/api.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import GameDetails from "./GameDetails";

export default function SetDetails({
  matchId,
  setId,
  setNumber,
  playerOne,
  playerTwo,
}) {
  const [games, setGames] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  const [setWinner, setSetWinner] = useState(null);  
  const [errorMessage, setErrorMessage] = useState("");
  const contentRef = useRef(null);

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

  useEffect(() => {
    const calculateSetWinner = () => {
      // Ensure players are defined
      if (!playerOne || !playerTwo) return;

      // Calculate the number of games won by each player
      let playerOneWins = 0;
      let playerTwoWins = 0;

      games.forEach((game) => {
        if (game.gameWinner === playerOne._id) {
          playerOneWins += 1;
        } else if (game.gameWinner === playerTwo._id) {
          playerTwoWins += 1;
        }
      });

      // Determine the set winner
      if (playerOneWins >= 4) {
        setSetWinner(playerOne);
      } else if (playerTwoWins >= 4) {
        setSetWinner(playerTwo);
      } else {
        setSetWinner(null);
      }
    };

    calculateSetWinner();
  }, [games, playerOne, playerTwo]);

  const handleAddGame = async () => {
    try {
      if (games.length === 7) {
        throw new Error("Maximum games reached!");
      }
      if (setWinner) {
        throw new Error(
          `Set already decided: ${setWinner.name.firstName} has won!`
        );
      }
      const newGame = {
        playerOne: playerOne,
        playerTwo: playerTwo,
        playerOneScore: 0,
        playerTwoScore: 0,
        gameWinner: null,
      };
      setGames([...games, newGame]);
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding game:", error);
      setErrorMessage(error.message);
    }
  };

  const handleGameComplete = (index, winner) => {
    const updatedGames = [...games];
    updatedGames[index].gameWinner = winner;
    setGames(updatedGames);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <section className="flex flex-col px-6 lg:px-2 py-1 sm:p-2 font-custom">
      <div
        className="bg-primary-blue text-center text-3xl font-bold text-white w-full self-center px-3 py-4 flex justify-between items-center cursor-pointer lg:flex-col lg:justify-center"
        onClick={toggleCollapse}
      >
        <h1 className="pl-2 lg:pl-0 lg:text-base">
          {setWinner ? (
            <div className="text-left lg:text-center">
              {`SET ${setNumber}:`}
              <br /> {setWinner.name.firstName.toUpperCase()}
            </div>
          ) : (
            `SET ${setNumber}`
          )}
        </h1>
        <FontAwesomeIcon
          icon={faChevronRight}
          className={`transform duration-200 ease-in-out ${
            collapsed ? "pt-2" : "rotate-90"
          }`}
        />
      </div>

      <div
        ref={contentRef}
        className={`overflow-hidden transition-[max-height] duration-200 ease-in-out ${
          collapsed ? "max-h-0" : "max-h-[1000px]"
        }`}
      >
        <div>
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

          {errorMessage && (
            <div className="text-center text-primary-yellow font-bold my-2">
              {errorMessage}
            </div>
          )}

          <button
            className="bg-primary-red text-white font-bold w-full self-center py-2 px-6 lg:px-2 border-t-2 border-secondary-blue"
            onClick={handleAddGame}
          >
            Add Game
          </button>
        </div>
      </div>
    </section>
  );
}
