import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMatchDetailsById, createSet } from "../utils/api";
import HomeButton from "../utils/HomeButton.js";
import SetDetails from "./SetDetails.js";
import "../index.css";

export default function MatchDetails() {
  const [match, setMatch] = useState(null);
  const [players, setPlayers] = useState([]);
  const [playerOneName, setPlayerOneName] = useState("");
  const [playerTwoName, setPlayerTwoName] = useState("");
  const [playerOneStateRank, setPlayerOneStateRank] = useState(0);
  const [playerTwoStateRank, setPlayerTwoStateRank] = useState(0);
  const [playerOneWorldRank, setPlayerOneWorldRank] = useState(0);
  const [playerTwoWorldRank, setPlayerTwoWorldRank] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [sets, setSets] = useState([]);
  const { matchId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchDetails = await fetchMatchDetailsById(matchId);
        setMatch(matchDetails);
        if (matchDetails) setSets(matchDetails.sets);
        setPlayers([matchDetails.players[0], matchDetails.players[1]]);
      } catch (err) {
        console.error("Error fetching match details:", err);
      }
    };
    fetchData();
  }, [matchId]);

  useEffect(() => {
    // Check if players data is available
    if (players.length >= 2) {
      try {
        let nameOne = "";
        let nameTwo = "";

        if (players[0]) {
          nameOne = players[0].callsign
            ? `${players[0].firstName} "${players[0].callsign}" ${players[0].lastName}`
            : `${players[0].firstName} ${players[0].lastName}`;
        }

        if (players[1]) {
          nameTwo = players[1].callsign
            ? `${players[1].firstName} "${players[1].callsign}" ${players[1].lastName}`
            : `${players[1].firstName} ${players[1].lastName}`;
        }

        setPlayerOneName(nameOne);
        setPlayerTwoName(nameTwo);
        setPlayerOneStateRank(players[0].stateRank);
        setPlayerTwoStateRank(players[1].stateRank);
        setPlayerOneWorldRank(players[0].worldRank);
        setPlayerTwoWorldRank(players[1].worldRank);
      } catch (err) {
        console.error("Error fetching player details:", err);
      }
    }
  }, [players]);

  if (!match) {
    return (
      <div className="bg-gradient-to-r md:bg-gradient-to-b from-secondary-blue to-tertiary-blue h-screen overflow-y-auto text-white text-4xl text-bold text-center p-48">
        Loading...
      </div>
    );
  }

  const handleAddSet = async (matchId) => {
    try {
      if (sets.length === 7) {
        throw new Error("Maximum sets reached!");
      }
      let newSet = await createSet(matchId);
      setSets((prevSets) => [...prevSets, newSet]);
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding set:", error);
      setErrorMessage(error.message);
    }
  };

  const getGridColumnsClass = (numSets) => {
    if (numSets <= 1) return "lg:grid-cols-1";
    if (numSets === 2) return "lg:grid-cols-2";
    if (numSets === 3) return "lg:grid-cols-3";
    if (numSets === 4) return "lg:grid-cols-4";
    if (numSets === 5) return "lg:grid-cols-5";
    if (numSets === 6) return "lg:grid-cols-6";
    if (numSets === 7) return "lg:grid-cols-7";
  };

  const gridColumnsClass = getGridColumnsClass(sets.length);

  return (
    <div className="flex flex-col min-h-screen sm:justify-center sm:p-4 bg-gradient-to-r md:bg-gradient-to-b from-secondary-blue to-tertiary-blue font-custom">
      <section
        id="playerInfo"
        className="sm:flex sm:flex-row sm:justify-between sm:p-4 w-[90%] lg:w-[75%] xl:w-[60%] self-center"
      >
        <div className="text-center mb-4 px-2">
          <h1 className="mt-8 sm:mt-0 text-3xl text-primary-yellow font-bold">
            {playerOneName.toUpperCase()}
          </h1>
          <h2 className="text-xl px-2 text-primary-yellow font-bold">
            (NC-{playerOneStateRank} | W-{playerOneWorldRank})
          </h2>
        </div>
        <h1 className="text-primary-yellow font-bold text-center self-center mb-4 px-4">
          VS.
        </h1>
        <div className="text-center mb-4">
          <h1 className="sm:mt-0 px-2 text-3xl text-primary-yellow font-bold">
            {playerTwoName.toUpperCase()}
          </h1>
          <h2 className="text-xl px-2 text-primary-yellow font-bold self-end">
            (NC-{playerTwoStateRank} | W-{playerTwoWorldRank})
          </h2>
        </div>
      </section>

      <section
        id="sets"
        className={`sm:grid sm:grid-cols-2 lg:grid-flow-col ${gridColumnsClass}`}
      >
        {sets.map((set, index) => {
          const isLastOddSet =
            sets.length % 2 !== 0 && index === sets.length - 1;
          return (
            <div
              key={index}
              className={`flex justify-center w-full ${
                isLastOddSet ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="w-full">
                <SetDetails
                  matchId={matchId}
                  setId={set._id}
                  playerOne={players[0]}
                  playerTwo={players[1]}
                  setNumber={index + 1}
                />
              </div>
            </div>
          );
        })}
      </section>

      {errorMessage && (
        <div className="text-center text-primary-yellow font-bold my-2">
          {errorMessage}
        </div>
      )}

      <div className="text-center md:flex-col">
        <button
          className="button bg-primary-red hover:bg-primary-blue text-white rounded font-bold w-[90%] lg:w-[70%] self-center px-4 py-3 my-2"
          onClick={() => handleAddSet(matchId)}
        >
          Add Set
        </button>
        <HomeButton />
      </div>
    </div>
  );
}
