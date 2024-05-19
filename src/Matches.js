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
      setResolvedMatches(
        resolvedMatchesData.sort((a, b) => b.timestamp - a.timestamp)
      );
    };

    fetchPlayerData();
  }, [matches]);

  if (error) {
    return (
      <div className="bg-gradient-to-r from-secondary-blue to-tertiary-blue font-custom flex-grow text-white">
        {error}
      </div>
    );
  }

  if (!resolvedMatches.length) {
    return (
      <div className="bg-gradient-to-r from-secondary-blue to-tertiary-blue font-custom flex-grow text-white">
        Loading...
      </div>
    );
  }

  const matchesList = resolvedMatches.map(
    ({ matchId, firstPlayerName, secondPlayerName, date }, index) => {
      const smRow = Math.floor(index / 2);
      const mdRow = Math.floor(index / 3);
      const lgRow = Math.floor(index / 5);

      const baseColorClass =
        index % 2 === 0
          ? "bg-primary-red hover:bg-primary-blue transition ease-in-out duration-200"
          : "bg-primary-blue hover:bg-primary-red transition ease-in-out duration-200";

      const smBGColorClass =
        smRow % 2 === 0
          ? "sm:bg-primary-red sm:hover:bg-primary-blue transition ease-in-out duration-200"
          : "sm:bg-primary-blue sm:hover:bg-primary-red transition ease-in-out duration-200";

      const mdBGColorClass =
        mdRow % 2 === 0
          ? "md:bg-primary-red md:hover:bg-primary-blue transition ease-in-out duration-200"
          : "md:bg-primary-blue md:hover:bg-primary-red transition ease-in-out duration-200";

      const lgBGColorClass =
        lgRow % 2 === 0
          ? "lg:bg-primary-red lg:hover:bg-primary-blue transition ease-in-out duration-200"
          : "lg:bg-primary-blue lg:hover:bg-primary-red transition ease-in-out duration-200";

      return (
        <li
          key={index}
          className={`p-3 text-center list-none ${baseColorClass} ${smBGColorClass} ${mdBGColorClass} ${lgBGColorClass} md:col-span-1 lg:col-span-1 shadow-xl`}
        >
          <Link
            to={`/matches/${matchId}`}
            className="flex items-center justify-center w-full h-full"
          >
            <div className="text-white font-bold px-5 rounded-md w-full h-full flex flex-col items-center justify-center">
              {`${firstPlayerName} vs. ${secondPlayerName}`}
              <br />
              <span className="text-sm text-primary-yellow">{date}</span>
            </div>
          </Link>
        </li>
      );
    }
  );

  // Render component content
  return (
    <section className="flex flex-col justify-center min-h-screen bg-gradient-to-r from-secondary-blue to-tertiary-blue font-custom flex-grow">
      <div className="text-center mt-6"><HomeButton /></div>
      <h1 className="text-3xl font-bold text-center text-white m-6">
        All Matches
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mx-6 xl:mx-48 p-2">
        {matchesList}
      </div>
      <div className="mt-6 text-center"><HomeButton /></div>
    </section>
  );
}
