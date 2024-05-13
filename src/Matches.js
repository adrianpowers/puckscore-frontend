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
  const [resolvedInProgressMatches, setResolvedInProgressMatches] = useState(
    []
  );
  const [pendingMatches, setPendingMatches] = useState([]);
  const [resolvedPendingMatches, setResolvedPendingMatches] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [resolvedCompletedMatches, setResolvedCompletedMatches] = useState([]);

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
        const inProgress = data.filter((match) => match.inProgress);
        const completed = data.filter(
          (match) => !match.inProgress & !match.pendingApproval
        );
        const pending = data.filter(
          (match) => !match.inProgress & match.pendingApproval
        );
        // Set state with in-progress and completed matches
        setMatchesInProgress(inProgress);
        setPendingMatches(pending);
        setCompletedMatches(completed);
      } catch (err) {
        // Set error state if fetch fails
        console.error("Error fetching matches:", err);
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
        const [firstPlayer, secondPlayer] = await Promise.all([
          firstPlayerPromise,
          secondPlayerPromise,
        ]);

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
        const [firstPlayer, secondPlayer] = await Promise.all([
          firstPlayerPromise,
          secondPlayerPromise,
        ]);

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

  // Fetch player information for each completed match
  useEffect(() => {
    // Map through pending matches and fetch player information
    const fetchPendingPlayerData = async () => {
      const promises = pendingMatches.map(async (match) => {
        // Fetch player information for both players in the match
        const firstPlayerPromise = findPlayerById(match.players[0]);
        const secondPlayerPromise = findPlayerById(match.players[1]);

        // Wait for both player promises to resolve
        const [firstPlayer, secondPlayer] = await Promise.all([
          firstPlayerPromise,
          secondPlayerPromise,
        ]);

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
      const resolvedPendingMatchesData = await Promise.all(promises);
      // Set state with resolved matches data
      setResolvedPendingMatches(resolvedPendingMatchesData);
    };

    // Call fetchPendingPlayerData function
    fetchPendingPlayerData();
  }, [completedMatches]);

  // Render matches in-progress list
  const renderInProgressMatches = () => {
    // Map through resolved in-progress matches and create JSX elements
    return resolvedInProgressMatches.map(
      ({ matchId, firstPlayerName, secondPlayerName, date }, index) =>
        index === resolvedInProgressMatches.length - 1 ? (
          index % 2 ? (
            <Link to={`/matches/${matchId}`} key={matchId}>
              <button className="bg-primary-red text-white font-bold px-5 py-3 rounded-md w-[85%] hover:bg-secondary-blue">
                {`${firstPlayerName} vs. ${secondPlayerName}`}
                <br />
                <span className="text-sm text-primary-yellow">{date}</span>
              </button>
            </Link>
          ) : (
            <Link to={`/matches/${matchId}`} key={matchId}>
              <button className="bg-secondary-blue text-white font-bold px-5 py-3 rounded-md w-[85%] hover:bg-primary-red">
                {`${firstPlayerName} vs. ${secondPlayerName}`}
                <br />
                <span className="text-sm text-primary-yellow">{date}</span>
              </button>
            </Link>
          )
        ) : index % 2 ? (
          <Link to={`/matches/${matchId}`} key={matchId}>
            <button className="bg-primary-red text-white font-bold px-5 py-3 rounded-md w-[85%] hover:bg-secondary-blue mb-2">
              {`${firstPlayerName} vs. ${secondPlayerName}`}
              <br />
              <span className="text-sm text-primary-yellow">{date}</span>
            </button>
          </Link>
        ) : (
          <Link to={`/matches/${matchId}`} key={matchId}>
            <button className="bg-secondary-blue text-white font-bold px-5 py-3 rounded-md w-[85%] hover:bg-primary-red mb-2">
              {`${firstPlayerName} vs. ${secondPlayerName}`}
              <br />
              <span className="text-sm text-primary-yellow">{date}</span>
            </button>
          </Link>
        )
    );
  };

  const renderPendingMatches = () => {
    // Map through matches that are pending approval before rank changes
    return resolvedPendingMatches.map(
      ({ matchId, firstPlayerName, secondPlayerName, date }, index) =>
        index === resolvedPendingMatches.length - 1 ? (
          index % 2 ? (
            <Link to={`/matches/${matchId}`} key={matchId}>
              <button className="bg-primary-red text-white font-bold px-5 py-3 rounded-md w-[85%] hover:bg-secondary-blue">
                {`${firstPlayerName} vs. ${secondPlayerName}`}
                <br />
                <span className="text-sm text-primary-yellow">{date}</span>
              </button>
            </Link>
          ) : (
            <Link to={`/matches/${matchId}`} key={matchId}>
              <button className="bg-secondary-blue text-white font-bold px-5 py-3 rounded-md w-[85%] hover:bg-primary-red">
                {`${firstPlayerName} vs. ${secondPlayerName}`}
                <br />
                <span className="text-sm text-primary-yellow">{date}</span>
              </button>
            </Link>
          )
        ) : index % 2 ? (
          <Link to={`/matches/${matchId}`} key={matchId}>
            <button className="bg-primary-red text-white font-bold px-5 py-3 rounded-md w-[85%] hover:bg-secondary-blue mb-2">
              {`${firstPlayerName} vs. ${secondPlayerName}`}
              <br />
              <span className="text-sm text-primary-yellow">{date}</span>
            </button>
          </Link>
        ) : (
          <Link to={`/matches/${matchId}`} key={matchId}>
            <button className="bg-secondary-blue text-white font-bold px-5 py-3 rounded-md w-[85%] hover:bg-primary-red mb-2">
              {`${firstPlayerName} vs. ${secondPlayerName}`}
              <br />
              <span className="text-sm text-primary-yellow">{date}</span>
            </button>
          </Link>
        )
    );
  };

  // Render completed matches list
  const renderCompletedMatches = () => {
    // Map through resolved completed matches and create JSX elements
    return resolvedCompletedMatches.map(
      ({ matchId, firstPlayerName, secondPlayerName, date }, index) =>
        index === resolvedCompletedMatches.length - 1 ? (
          index % 2 ? (
            <Link to={`/matches/${matchId}`} key={matchId}>
              <button className="bg-primary-red text-white font-bold px-5 py-3 rounded-md w-[85%] hover:bg-secondary-blue">
                {`${firstPlayerName} vs. ${secondPlayerName}`}
                <br />
                <span className="text-sm text-primary-yellow">{date}</span>
              </button>
            </Link>
          ) : (
            <Link to={`/matches/${matchId}`} key={matchId}>
              <button className="bg-secondary-blue text-white font-bold px-5 py-3 rounded-md w-[85%] hover:bg-primary-red">
                {`${firstPlayerName} vs. ${secondPlayerName}`}
                <br />
                <span className="text-sm text-primary-yellow">{date}</span>
              </button>
            </Link>
          )
        ) : index % 2 ? (
          <Link to={`/matches/${matchId}`} key={matchId}>
            <button className="bg-primary-red text-white font-bold px-5 py-3 rounded-md w-[85%] hover:bg-secondary-blue mb-2">
              {`${firstPlayerName} vs. ${secondPlayerName}`}
              <br />
              <span className="text-sm text-primary-yellow">{date}</span>
            </button>
          </Link>
        ) : (
          <Link to={`/matches/${matchId}`} key={matchId}>
            <button className="bg-secondary-blue text-white font-bold px-5 py-3 rounded-md w-[85%] hover:bg-primary-red mb-2">
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
    <section className="flex flex-col justify-center min-h-screen bg-primary-blue font-custom flex-grow">
      <div className="text-center mt-6">{<HomeButton />}</div>
      <h1 className="text-3xl font-bold text-center text-white m-6">
        Matches in Progress
      </h1>
      <div className="text-center mx-6 p-2">
        <ul className="text-white items-center">{renderInProgressMatches()}</ul>
      </div>
      <h1 className="text-3xl font-bold text-center text-white m-6">
        Completed Matches
      </h1>
      <div className="text-center mx-6 p-2">
        <ul className="text-white items-center">{renderCompletedMatches()}</ul>
      </div>
      <h1 className="text-3xl font-bold text-center text-white m-6">
        Pending Admin Approval
      </h1>
      <div className="text-center mx-6 p-2">
        <ul className="text-white items-center">{renderPendingMatches()}</ul>
      </div>
      <div className="mt-6 text-center">{<HomeButton />}</div>
    </section>
  );
}
