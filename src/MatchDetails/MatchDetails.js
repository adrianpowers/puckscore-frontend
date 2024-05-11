import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMatchDetailsById, findPlayerById } from "../utils/api";
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
  const { matchId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchDetails = await fetchMatchDetailsById(matchId);
        setMatch(matchDetails);
        let fetchedPlayers = [];
        for (let player of matchDetails.players) {
          const fetchedPlayer = await findPlayerById(player);
          fetchedPlayers.push(fetchedPlayer);
        }
        setPlayers(fetchedPlayers);
      } catch (err) {
        console.error("Error fetching match details:", err);
      }
    };
    fetchData();

    console.log(players);
  }, [matchId]);

  useEffect(() => {
    // Check if players data is available
    if (players.length >= 2) {
      try {
        let nameOne = "";
        let nameTwo = "";

        if (players[0]) {
          nameOne = players[0].name.callsign
            ? `${players[0].name.firstName} "${players[0].name.callsign}" ${players[0].name.lastName}`
            : `${players[0].name.firstName} ${players[0].name.lastName}`;
        }

        if (players[1]) {
          nameTwo = players[1].name.callsign
            ? `${players[1].name.firstName} "${players[1].name.callsign}" ${players[1].name.lastName}`
            : `${players[1].name.firstName} ${players[1].name.lastName}`;
        }

        setPlayerOneName(nameOne);
        setPlayerTwoName(nameTwo);
        setPlayerOneStateRank(players[0].stateRank);
        setPlayerTwoStateRank(players[1].stateRank);
        setPlayerOneWorldRank(players[0].worldRank);
        setPlayerTwoWorldRank(players[1].worldRank);

        console.log(players);
        console.log(playerOneName, playerTwoName);
      } catch (err) {
        console.error("Error fetching player details:", err);
      }
    }
  }, [players]);

  if (!match) {
    return <div>Loading...</div>;
  }

  console.log(players);
  console.log(playerOneName, playerTwoName);

  return (
    <div className="flex flex-col md:flex-row md:justify-center md:p-4 h-screen bg-primary-blue">
      <div className="md:text-left text-center md:mr-4 mb-4 ">
        <h1 className="mt-8 md:mt-0 px-2 text-3xl text-primary-yellow font-bold">
          {playerOneName.toUpperCase()}
        </h1>
        <h2 className="text-xl px-2 text-primary-yellow font-bold">
          (NC-{playerOneStateRank} | W-{playerOneWorldRank})
        </h2>
      </div>
      <h1 className="text-primary-yellow font-bold self-center md:self-auto mb-4 md:mb-0 md:mt-4">VS.</h1>
      <div className="md:text-right text-center md:ml-4">
        <h1 className="md:mt-0 px-2 text-3xl text-primary-yellow font-bold">
          {playerTwoName.toUpperCase()}
        </h1>
        <h2 className="text-xl px-2 text-primary-yellow font-bold">
          (NC-{playerTwoStateRank} | W-{playerTwoWorldRank})
        </h2>
      </div>
    </div>
  );
  
}
