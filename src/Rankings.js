import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchRankings } from "./utils/api";
import "./index.css";

export default function Rankings() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVertical, setIsVertical] = useState(false);
  const homeButton = (
    <Link to="/">
      <button className="bg-primary-red text-white text-xl px-3 py-2 mb-2 rounded-full w-40 mr-1">
        Home
      </button>
    </Link>
  );

  useEffect(() => {
    const ac = new AbortController();

    // This function fetches the rankings data using the utils/api.
    async function fetchRankingsData() {
      try {
        const data = await fetchRankings(ac.signal);
        setRankings(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }

    // On load, this function is defined and run; it checks the device orientation and sets the state.
    const checkDeviceOrientation = () => {
      setIsVertical(window.matchMedia("(orientation: portrait)").matches);
    };

    checkDeviceOrientation();

    // This function checks for resizing the screen
    const handleOrientationChange = () => {
      checkDeviceOrientation();
    };

    // Add event listeners for orientation change and window resize
    window.addEventListener("resize", handleOrientationChange);

    // Finally, fetch the rankings data.
    fetchRankingsData();

    // AbortController and event listener cleanup.
    return () => {
      ac.abort();
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, [isVertical]);

  // We all hate scrolling through long lists in horizontal mode, but the main utility
  // of this app works far better in horizontal. So,i f the device is in horizontal orientation,
  // this code returns an error message stating to rotate the device, as well as a home button.

  if (!isVertical) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-primary-blue">
        <h2 className="text-xl text-white mb-5">
          Please rotate your phone to view the current rankings!
        </h2>
        {homeButton}
      </div>
    );
  }

  // Returns a loading div.

  if (loading) {
    return (
      <div className="bg-primary-blue font-custom flex-grow">Loading...</div>
    );
  }

  // Returns an error div.

  if (error) {
    return <div>Error: {error}</div>;
  }

  // This sorts the player list by state rank, moves all players with world ranks but
  // no (null) state rank to the bottom, then maps them to list items that display
  // their names, callsigns, and ranks.

  const rankingsList = rankings
    .sort((a, b) => {
      if (a.stateRank === null && b.stateRank === null) {
        return 0;
      } else if (a.stateRank === null) {
        return 1;
      } else if (b.stateRank === null) {
        return -1;
      }
      return a.stateRank - b.stateRank;
    })
    .map((player, index) => {
      const nameParts = player.name.split(" ");
      if (player.callsign) {
        // Insert callsign between the first and last name
        nameParts.splice(1, 0, `"${player.callsign}"`);
      }
      const formattedName = nameParts.join(" ");
      return (
        <li key={index} className="my-2 text-center">
          <b className="text-2xl">{formattedName.toUpperCase()}</b>
          <br />
          {player.stateRank ? (
            <div>
              <span>NORTH CAROLINA RANK: <b className="text-xl">{player.stateRank}</b></span>
              <br />
            </div>
          ) : null}
          {player.worldRank ? (
            <div>
              <span>WORLD RANK: <b className="text-xl">{player.worldRank}</b></span>
              <br />
            </div>
          ) : null}
          <hr className="my-2" />
        </li>
      );
    });

  // The following return only appears if the screen is vertical.
  return (
    <section className="flex flex-col min-h-screen bg-primary-blue font-custom flex-grow">
      <h1 className="text-4xl font-bold text-center text-white m-6">
        Current Rankings
      </h1>
      <div className="flex justify-center">{homeButton}</div>
      <div className="flex justify-center mx-6 p-2 border-red-500">
        <ul className="text-white">{rankingsList}</ul>
      </div>
      <div className="flex justify-center">{homeButton}</div>
    </section>
  );
}
