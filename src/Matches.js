// Import necessary modules and components
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HomeButton from "./utils/HomeButton";
import { fetchMatches, findPlayerById } from "./utils/api";
import "./index.css";

// Define the Matches component
export default function Matches() {
  // State variables to store matches data, resolved matches, and error
  const [matchesInProgress, setMatchesInProgress] = useState([]);
  const [resolvedInProgressMatches, setResolvedInProgressMatches] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [resolvedCompletedMatches, setResolvedCompletedMatches] = useState([]);
  const [error, setError] = useState(null);

  // Fetch matches data when the component mounts
  useEffect(() => {
    // Abort controller to handle fetch cancellation
    const ac = new AbortController();

    // Function to fetch matches data
    async function fetchMatchesData() {
      try {
        // Fetch matches data
        const data = await fetchMatches(ac.signal);
        // Filter in-progress and completed matches
        const inProgress = data.filter(match => match.inProgress);
        const completed = data.filter(match => !match.inProgress);
        // Set state with in-progress and completed matches
        setMatchesInProgress(inProgress);
        setCompletedMatches(completed);
      } catch (error) {
        // Set error state if fetch fails
        setError(error.message);
      }
    }

    // Call fetchMatchesData function
    fetchMatchesData();

    // Cleanup function to abort fetch if component unmounts
    return () => {
      ac.abort();
    };
  }, []);

  // Fetch player information for each match in progress
  useEffect(() => {
    // Map through in-progress matches and fetch player information
    const fetchInProgressPlayerData = async () => {
      const promises = matchesInProgress.map(async (match) => {
        // Fetch player information for both players in the match
        const firstPlayerPromise = findPlayerById(match.players[0]);
        const secondPlayerPromise = findPlayerById(match.players[1]);

        // Wait for both player promises to resolve
        const [firstPlayer, secondPlayer] = await Promise.all([firstPlayerPromise, secondPlayerPromise]);

        // Format player names
        const firstPlayerName = `${firstPlayer.name.firstName} ${firstPlayer.name.lastName}`;
        const secondPlayerName = `${secondPlayer.name.firstName} ${secondPlayer.name.lastName}`;

        // Return formatted match data
        return {
          matchId: match._id,
          firstPlayerName,
          secondPlayerName,
          date: new Date(match.date).toLocaleDateString(),
        };
      });

      // Wait for all promises to resolve
      const resolvedInProgressMatchesData = await Promise.all(promises);
      // Set state with resolved matches data
      setResolvedInProgressMatches(resolvedInProgressMatchesData);
    };

    // Call fetchInProgressPlayerData function
    fetchInProgressPlayerData();
  }, [matchesInProgress]);

  // Fetch player information for each completed match
  useEffect(() => {
    // Map through completed matches and fetch player information
    const fetchCompletedPlayerData = async () => {
      const promises = completedMatches.map(async (match) => {
        // Fetch player information for both players in the match
        const firstPlayerPromise = findPlayerById(match.players[0]);
        const secondPlayerPromise = findPlayerById(match.players[1]);

        // Wait for both player promises to resolve
        const [firstPlayer, secondPlayer] = await Promise.all([firstPlayerPromise, secondPlayerPromise]);

        // Format player names
        const firstPlayerName = `${firstPlayer.name.firstName} ${firstPlayer.name.lastName}`;
        const secondPlayerName = `${secondPlayer.name.firstName} ${secondPlayer.name.lastName}`;

        // Return formatted match data
        return {
          matchId: match._id,
          firstPlayerName,
          secondPlayerName,
          date: new Date(match.date).toLocaleDateString(),
        };
      });

      // Wait for all promises to resolve
      const resolvedCompletedMatchesData = await Promise.all(promises);
      // Set state with resolved matches data
      setResolvedCompletedMatches(resolvedCompletedMatchesData);
    };

    // Call fetchCompletedPlayerData function
    fetchCompletedPlayerData();
  }, [completedMatches]);

  // Render matches in-progress list
  const renderInProgressMatches = () => {
    // Map through resolved in-progress matches and create JSX elements
    return resolvedInProgressMatches.map(({ matchId, firstPlayerName, secondPlayerName, date }) => (
      <Link to={`/match/${matchId}`} key={matchId}>
        <button className="bg-primary-red text-white font-bold px-5 py-3 rounded-md mb-4">
          {`${firstPlayerName} vs. ${secondPlayerName}`}
          <br />
          <span className="text-sm text-primary-yellow">
            {date}
          </span>
        </button>
      </Link>
    ));
  };

  // Render completed matches list
  const renderCompletedMatches = () => {
    // Map through resolved completed matches and create JSX elements
    return resolvedCompletedMatches.map(({ matchId, firstPlayerName, secondPlayerName, date }) => (
      <Link to={`/match/${matchId}`} key={matchId}>
        <button className="bg-primary-red text-white font-bold px-5 py-3 rounded-md mb-4">
          {`${firstPlayerName} vs. ${secondPlayerName}`}
          <br />
          <span className="text-sm text-primary-yellow">
            {date}
          </span>
        </button>
      </Link>
    ));
  };

  // Render component content
  return (
    <section className="flex flex-col min-h-screen bg-primary-blue font-custom flex-grow">
      <div className="flex justify-center mt-6">{<HomeButton />}</div>
      <h1 className="text-3xl font-bold text-center text-white m-6">
        Matches in Progress
      </h1>
      <div className="flex justify-center mx-6 p-2">
        <ul className="text-white">{renderInProgressMatches()}</ul>
      </div>
      <h1 className="text-3xl font-bold text-center text-white m-6">
        Completed Matches
      </h1>
      <div className="flex justify-center mx-6 p-2">
        <ul className="text-white">{renderCompletedMatches()}</ul>
      </div>
      <div className="flex justify-center">{<HomeButton />}</div>
    </section>
  );
}
