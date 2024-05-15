import React, { useState, useEffect } from "react";
import HomeButton from "./utils/HomeButton";
import { fetchRankings, searchPlayersByName } from "./utils/api";
import "./index.css";

export default function Rankings() {
  const [rankings, setRankings] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    // Finally, fetch the rankings data.
    fetchRankingsData();

    // AbortController and event listener cleanup.
    return () => {
      ac.abort();
    };
  }, []);

  // Returns a loading div.

  if (loading) {
    return (
      <div className="bg-secondary-blue font-custom flex-grow text-white">Loading...</div>
    );
  }

  // Returns an error div.

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSearch = (searchQuery) => {
    searchPlayersByName(searchQuery)
      .then((results) => setSearchResults(results))
      .catch((error) => {
        console.error("Error searching players:", error);
        setSearchResults([]);
      });
  };

  const handleChange = (event) => {
    handleSearch(event.target.value);
  };

  // This sorts the player list by state rank, moves all players with world ranks but
  // no (null) state rank to the bottom, then maps them to list items that display
  // their names, callsigns, and ranks.

  const filteredRankings = searchResults.length > 0 ? searchResults : rankings;

  const rankingsList = filteredRankings
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
      const firstName = player.name.firstName;
      const callsign = player.name.callsign || null;
      const lastName = player.name.lastName;
      let formattedName = "";

      if (callsign) {
        formattedName = `${firstName} "${callsign}" ${lastName}`;
      } else {
        formattedName = `${firstName} ${lastName}`;
      }

      // Calculate row and column indices based on desired layout
      const smRow = Math.floor(index / 2);
      const mdRow = Math.floor(index / 3);
      const lgRow = Math.floor(index / 4);
      const col = index % 3;

      const baseColorClass =
        index % 2 === 0 ? "bg-primary-red" : "bg-primary-blue";

      const smBGColorClass =
        smRow % 2 === 0 ? "sm:bg-primary-red" : "sm:bg-primary-blue";

      // Apply different background colors for even and odd rows
      const mdBGColorClass =
        mdRow % 2 === 0 ? "md:bg-primary-red" : "md:bg-primary-blue";

      const lgBGColorClass =
        lgRow % 2 === 0 ? "lg:bg-primary-red" : "lg:bg-primary-blue";

      // Adjust the column placement based on col index
      const colClass =
        col === 0
          ? "md:col-span-1"
          : col === 1
          ? "md:col-span-1 md:col-start-2"
          : "md:col-span-1 md:col-start-3";

      return (
        <li
          key={index}
          className={`my-2 text-center md:col-span-1 sm:h-56 md:h-64 ${baseColorClass} ${smBGColorClass} ${mdBGColorClass} ${lgBGColorClass} ${colClass} shadow-xl`}
        >
          {player.stateRank ? (
            <div className="p-2 sm:pt-4">
              <b className="text-3xl underline">NC-{player.stateRank}</b>
            </div>
          ) : null}
          <button className="button w-[85%] p-2 rounded ">
            <b className="text-2xl">{formattedName.toUpperCase()}</b>
            {player.worldRank ? (
              <div>
                <b className="text-xl">(W-{player.worldRank})</b>
              </div>
            ) : null}
          </button>
        </li>
      );
    });

  return (
    <section className="bg-secondary-blue min-h-screen font-custom">
      <h1 className="text-4xl font-bold text-center text-white p-6">
        Current Rankings
      </h1>
      <div className="text-center">{<HomeButton />}</div>

      <div className="mx-auto mt-3 w-[40%]">
        <label htmlFor="player_name" className="hidden text-white">
          Player Name
        </label>
        <input
          required
          id="player_name"
          type="text"
          name="player_name"
          placeholder={"Search for a Player"}
          onChange={handleChange} // Call handleChange on input change
          className="form-input text-center px-1 mb-2 w-full h-8"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4 mx-6 p-2">
        {rankingsList.map((item, index) => (
          <ul key={index} className={`text-white sm:col-span-1`}>
            {item}
          </ul>
        ))}
      </div>
      <div className="text-center">{<HomeButton />}</div>
    </section>
  );
}
