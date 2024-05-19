import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HomeButton from "./utils/HomeButton";
import { fetchMatches, findPlayerById } from "./utils/api";
import "./index.css";

// Define the Matches component
export default function Matches() {
  // State variables to store matches data and error
  const [matches, setMatches] = useState([]);
  const [resolvedMatches, setResolvedMatches] = useState([]);
  const [error, setError] = useState(null);

  // Fetch matches data when the component mounts
  useEffect(() => {
    const ac = new AbortController();

    async function fetchMatchesData() {
      try {
        const data = await fetchMatches(ac.signal);
        setMatches(data);
      } catch (err) {
        console.error("Error fetching matches:", err);
        setError("Error fetching matches.");
      }
    }

    fetchMatchesData();

    return () => {
      ac.abort();
    };
  }, []);

  // Fetch player information for each match
  useEffect(() => {
    const fetchPlayerData = async () => {
      const promises = matches.map(async (match) => {
        const firstPlayerPromise = findPlayerById(match.players[0]);
        const secondPlayerPromise = findPlayerById(match.players[1]);

        const [firstPlayer, secondPlayer] = await Promise.all([
          firstPlayerPromise,
          secondPlayerPromise,
        ]);

        const firstPlayerName = `${firstPlayer.name.firstName} ${firstPlayer.name.lastName}`;
        const secondPlayerName = `${secondPlayer.name.firstName} ${secondPlayer.name.lastName}`;

        return {
          matchId: match._id,
          firstPlayerName,
          secondPlayerName,
          date: new Date(match.date).toLocaleDateString(),
          timestamp: new Date(match.date).getTime(),
        };
      });

      const resolvedMatchesData = await Promise.all(promises);
      setResolvedMatches(resolvedMatchesData.sort((a, b) => b.timestamp - a.timestamp));
    };

    fetchPlayerData();
  }, [matches]);

  if (error) {
    return <div className="bg-gradient-to-r from-secondary-blue to-tertiary-blue font-custom flex-grow text-white">{error}</div>;
  }

  if (!resolvedMatches.length) {
    return (
      <div className="bg-gradient-to-r from-secondary-blue to-tertiary-blue font-custom flex-grow text-white">Loading...</div>
    );
  }

  // Render matches list
  const renderMatches = () => {
    return resolvedMatches.map(
      ({ matchId, firstPlayerName, secondPlayerName, date }, index) =>
        index === resolvedMatches.length - 1 ? (
          index % 2 ? (
            <Link to={`/matches/${matchId}`} key={matchId}>
              <button className="bg-primary-red text-white font-bold px-5 py-3 rounded-md w-[85%] hover:bg-primary-blue">
                {`${firstPlayerName} vs. ${secondPlayerName}`}
                <br />
                <span className="text-sm text-primary-yellow">{date}</span>
              </button>
            </Link>
          ) : (
            <Link to={`/matches/${matchId}`} key={matchId}>
              <button className="bg-primary-blue text-white font-bold px-5 py-3 rounded-md w-[85%] hover:bg-primary-red">
                {`${firstPlayerName} vs. ${secondPlayerName}`}
                <br />
                <span className="text-sm text-primary-yellow">{date}</span>
              </button>
            </Link>
          )
        ) : index % 2 ? (
          <Link to={`/matches/${matchId}`} key={matchId}>
            <button className="bg-primary-red text-white font-bold px-5 py-3 rounded-md w-[85%] hover:bg-primary-blue mb-2">
              {`${firstPlayerName} vs. ${secondPlayerName}`}
              <br />
              <span className="text-sm text-primary-yellow">{date}</span>
            </button>
          </Link>
        ) : (
          <Link to={`/matches/${matchId}`} key={matchId}>
            <button className="bg-primary-blue text-white font-bold px-5 py-3 rounded-md w-[85%] hover:bg-primary-red mb-2">
              {`${firstPlayerName} vs. ${secondPlayerName}`}
              <br />
              <span className="text-sm text-primary-yellow">{date}</span>
            </button>
          </Link>
        )
    );
  };

  // Render component content
  return (
    <section className="flex flex-col justify-center min-h-screen bg-gradient-to-r from-secondary-blue to-tertiary-blue font-custom flex-grow">
      <div className="text-center mt-6">{<HomeButton />}</div>
      <h1 className="text-3xl font-bold text-center text-white m-6">All Matches</h1>
      <div className="text-center mx-6 p-2">
        <ul className="text-white items-center">{renderMatches()}</ul>
      </div>
      <div className="mt-6 text-center">{<HomeButton />}</div>
    </section>
  );
}
