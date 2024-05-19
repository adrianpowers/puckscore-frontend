import React, { useState, useRef, useEffect } from "react";
import HomeButton from "../utils/HomeButton.js"; // Importing the HomeButton component using relative path

export default function NewMatchForm({
  newMatch,
  handleChange,
  handleSubmit,
  handlePlayerSelect,
  playerOneSearchResults,
  playerTwoSearchResults,
}) {
  const [selectedSets, setSelectedSets] = useState(newMatch.sets_to_win);
  const [playerOneDropdownVisible, setPlayerOneDropdownVisible] =
    useState(false);
  const [playerTwoDropdownVisible, setPlayerTwoDropdownVisible] =
    useState(false);
  const playerOneDropdownRef = useRef(null);
  const playerTwoDropdownRef = useRef(null);

  const handleSetSelection = (sets) => {
    setSelectedSets(sets);
    handleChange({ target: { name: "sets_to_win", value: sets } });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        playerOneDropdownRef.current &&
        !playerOneDropdownRef.current.contains(event.target)
      ) {
        setPlayerOneDropdownVisible(false);
      }
      if (
        playerTwoDropdownRef.current &&
        !playerTwoDropdownRef.current.contains(event.target)
      ) {
        setPlayerTwoDropdownVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <div className="flex justify-evenly flex-wrap">
        {/* PlayerOne (Player 1) */}
        <div className="relative flex flex-col items-center mb-7 w-[90%]">
          <label htmlFor="playerOne_name" className="hidden text-white">
            Player One Name
          </label>
          <input
            required
            id="playerOne_name"
            type="text"
            name="playerOne_name"
            placeholder="Search for a Player"
            value={newMatch.playerOne_name}
            onChange={handleChange}
            onFocus={() => setPlayerOneDropdownVisible(true)}
            className="form-input text-center p-1 mb-2 w-full"
          />
          {playerOneDropdownVisible && (
            <div
              ref={playerOneDropdownRef}
              className="absolute z-10 mt-1 w-full bg-white rounded border border-gray-300 shadow-md"
            >
              {/* Dropdown items */}
              {playerOneSearchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded border border-gray-300 shadow-md">
                  {/* Dropdown items */}
                  {playerOneSearchResults.map((result) => (
                    <div
                      key={result._id}
                      className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                      onClick={() =>
                        handlePlayerSelect(
                          result.name.firstName,
                          result.name.lastName,
                          result.stateRank,
                          result.worldRank,
                          true
                        )
                      }
                    >
                      {result.name.callsign
                        ? `${result.name.firstName} "${result.name.callsign}" ${result.name.lastName}`
                        : `${result.name.firstName} ${result.name.lastName}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center w-full gap-x-3">
            <div>
              <label htmlFor="playerOne_state_rank" className="text-white">
                State Rank
              </label>
              <input
                id="playerOne_state_rank"
                type="number"
                name="playerOne_state_rank"
                placeholder="0"
                value={parseInt(newMatch.playerOne_state_rank)}
                onChange={handleChange}
                className="form-input px-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="playerOne_world_rank" className="text-white">
                World Rank
              </label>
              <input
                id="playerOne_world_rank"
                type="number"
                name="playerOne_world_rank"
                placeholder="0"
                value={parseInt(newMatch.playerOne_world_rank)}
                onChange={handleChange}
                className="form-input px-1 w-full"
              />
            </div>
          </div>
        </div>

        {/* PlayerTwo (Player 2) */}
        <div className="relative flex flex-col items-center mt-4 w-[90%]">
          <label htmlFor="playerTwo_name" className="hidden text-white">
            Player Two Name
          </label>
          <input
            required
            id="playerTwo_name"
            type="text"
            name="playerTwo_name"
            placeholder="Search for a Player"
            value={newMatch.playerTwo_name}
            onChange={handleChange}
            onFocus={() => setPlayerTwoDropdownVisible(true)}
            className="form-input text-center p-1 mb-2 w-full"
          />
          {playerTwoDropdownVisible && (
            <div
              ref={playerTwoDropdownRef}
              className="absolute z-10 mt-1 w-full bg-white rounded border border-gray-300 shadow-md"
            >
              {/* Dropdown items */}
              {playerTwoSearchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded border border-gray-300 shadow-md">
                  {/* Dropdown items */}
                  {playerTwoSearchResults.map((result) => (
                    <div
                      key={result._id}
                      className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                      onClick={() =>
                        handlePlayerSelect(
                          result.name.firstName,
                          result.name.lastName,
                          result.stateRank,
                          result.worldRank,
                          false
                        )
                      }
                    >
                      {result.name.callsign
                        ? `${result.name.firstName} "${result.name.callsign}" ${result.name.lastName}`
                        : `${result.name.firstName} ${result.name.lastName}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center w-full gap-x-3">
            <div>
              <label htmlFor="playerTwo_state_rank" className="text-white mr-3">
                State Rank
              </label>
              <input
                id="playerTwo_state_rank"
                type="number"
                name="playerTwo_state_rank"
                placeholder="0"
                value={parseInt(newMatch.playerTwo_state_rank)}
                onChange={handleChange}
                className="form-input px-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="playerTwo_world_rank" className="text-white">
                World Rank
              </label>
              <input
                id="playerTwo_world_rank"
                type="number"
                name="playerTwo_world_rank"
                placeholder="0"
                value={parseInt(newMatch.playerTwo_world_rank)}
                onChange={handleChange}
                className="form-input px-1 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <fieldset className="flex justify-center items-center col-span-2 mt-8 text-center">
        <legend className="text-2xl text-white font-bold mb-3">
          Number of Sets
        </legend>
        <div className="grid grid-cols-2 gap-3 w-[90%]">
          <div
            className={`rounded-md py-4 flex justify-center items-center cursor-pointer ${
              selectedSets === 1
                ? "bg-primary-blue  text-white"
                : "bg-primary-red hover:bg-primary-yellow text-white hover:text-black transition ease-in-out duration-200"
            }`}
            onClick={() => handleSetSelection(1)}
          >
            <span>1 set of 1</span>
          </div>
          <div
            className={`rounded-md py-4 flex justify-center items-center cursor-pointer ${
              selectedSets === 2
                ? "bg-primary-blue text-white"
                : "bg-primary-red hover:bg-primary-yellow text-white hover:text-black transition ease-in-out duration-200"
            }`}
            onClick={() => handleSetSelection(2)}
          >
            <span>2 sets of 3</span>
          </div>
          <div
            className={`rounded-md py-4 flex justify-center items-center cursor-pointer ${
              selectedSets === 3
                ? "bg-primary-blue text-white"
                : "bg-primary-red hover:bg-primary-yellow text-white hover:text-black transition ease-in-out duration-200"
            }`}
            onClick={() => handleSetSelection(3)}
          >
            <span>3 sets of 5</span>
          </div>
          <div
            className={`rounded-md py-4 flex justify-center items-center cursor-pointer ${
              selectedSets === 4
                ? "bg-primary-blue text-white"
                : "bg-primary-red hover:bg-primary-yellow text-white hover:text-black transition ease-in-out duration-200"
            }`}
            onClick={() => handleSetSelection(4)}
          >
            <span>4 sets of 7</span>
          </div>
        </div>
      </fieldset>

      <div className="flex flex-col items-center col-span-2 mt-6 gap-y-2">
        <button
          type="submit"
          className="bg-primary-blue hover:bg-primary-red text-white text-xl font-bold py-5 w-[90%] rounded transition ease-in-out duration-200"
        >
          Create New Match
        </button>
      </div>
      <div className="text-center mt-4">
        <HomeButton />
      </div>
    </form>
  );
}
