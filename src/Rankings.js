import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

    fetchRankingsData();

    return () => {
      ac.abort();
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-r from-secondary-blue to-tertiary-blue font-custom flex-grow text-white text-center">
        Loading...
      </div>
    );
  }

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

      const smRow = Math.floor(index / 2);
      const mdRow = Math.floor(index / 3);
      const lgRow = Math.floor(index / 4);

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
          className={` text-center list-none ${baseColorClass} ${smBGColorClass} ${mdBGColorClass} ${lgBGColorClass} md:col-span-1 lg:col-span-1 shadow-xl`}
        >
          <Link
            to={`/players/${player._id}`}
            className="flex items-center justify-center w-full h-full"
          >
            <div className="text-white font-bold p-2 w-full h-full flex flex-col items-center justify-center">
              {player.stateRank ? (
                <b className="text-3xl underline">NC-{player.stateRank}</b>
              ) : null}
              <div className="text-2xl">{formattedName.toUpperCase()}</div>
              {player.worldRank ? (
                <div>
                  <b className="text-xl">(W-{player.worldRank})</b>
                </div>
              ) : null}
            </div>
          </Link>
        </li>
      );
    });

  return (
    <section className="bg-gradient-to-r from-secondary-blue to-tertiary-blue min-h-screen font-custom">
      <h1 className="text-4xl font-bold text-center text-white p-6">
        Current Rankings
      </h1>
      <div className="text-center">
        <HomeButton />
      </div>

      <div className="mx-auto mt-3 w-[40%]">
        <label htmlFor="player_name" className="hidden text-white">
          Player Name
        </label>
        <input
          required
          id="player_name"
          type="text"
          name="player_name"
          placeholder="Search for a Player"
          onChange={handleChange}
          className="form-input text-center px-1 mb-2 w-full h-8"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mx-6 p-2">
        {rankingsList}
      </div>
      <div className="text-center">
        <HomeButton />
      </div>
    </section>
  );
}
