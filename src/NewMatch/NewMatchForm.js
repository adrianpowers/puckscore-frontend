import React, { useState, useRef, useEffect } from "react";
import HomeButton from "../utils/HomeButton.js"; // Importing the HomeButton component using relative path

export default function NewMatchForm({
  newMatch,
  handleChange,
  handleSubmit,
  handlePlayerSelect,
  challengerSearchResults,
  challengedSearchResults,
}) {
  const [selectedSets, setSelectedSets] = useState(newMatch.sets_to_win);
  const [challengerDropdownVisible, setChallengerDropdownVisible] =
    useState(false);
  const [challengedDropdownVisible, setChallengedDropdownVisible] =
    useState(false);
  const challengerDropdownRef = useRef(null);
  const challengedDropdownRef = useRef(null);

  const handleSetSelection = (sets) => {
    setSelectedSets(sets);
    handleChange({ target: { name: "sets_to_win", value: sets } });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        challengerDropdownRef.current &&
        !challengerDropdownRef.current.contains(event.target)
      ) {
        setChallengerDropdownVisible(false);
      }
      if (
        challengedDropdownRef.current &&
        !challengedDropdownRef.current.contains(event.target)
      ) {
        setChallengedDropdownVisible(false);
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
        {/* Challenger (Player 1) */}
        <div className="relative flex flex-col items-center mb-7 w-[90%]">
          <label htmlFor="challenger_name" className="hidden text-white">
            Challenger Name
          </label>
          <input
            required
            id="challenger_name"
            type="text"
            name="challenger_name"
            placeholder="Challenger's Name"
            value={newMatch.challenger_name}
            onChange={handleChange}
            onFocus={() => setChallengerDropdownVisible(true)}
            className="form-input text-center px-1 mb-2 w-full"
          />
          {challengerDropdownVisible && (
            <div
              ref={challengerDropdownRef}
              className="absolute z-10 mt-1 w-full bg-white rounded border border-gray-300 shadow-md"
            >
              {/* Dropdown items */}
              {challengerSearchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded border border-gray-300 shadow-md">
                  {/* Dropdown items */}
                  {challengerSearchResults.map((result) => (
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
              <label htmlFor="challenger_state_rank" className="text-white">
                State Rank
              </label>
              <input
                id="challenger_state_rank"
                type="number"
                name="challenger_state_rank"
                placeholder="0"
                value={parseInt(newMatch.challenger_state_rank)}
                onChange={handleChange}
                className="form-input px-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="challenger_world_rank" className="text-white">
                World Rank
              </label>
              <input
                id="challenger_world_rank"
                type="number"
                name="challenger_world_rank"
                placeholder="0"
                value={parseInt(newMatch.challenger_world_rank)}
                onChange={handleChange}
                className="form-input px-1 w-full"
              />
            </div>
          </div>
        </div>

        {/* Challenged (Player 2) */}
        <div className="relative flex flex-col items-center mt-4 w-[90%]">
          <label htmlFor="challenged_name" className="hidden text-white">
            Challenged Name
          </label>
          <input
            required
            id="challenged_name"
            type="text"
            name="challenged_name"
            placeholder="Challenged Player's Name"
            value={newMatch.challenged_name}
            onChange={handleChange}
            onFocus={() => setChallengedDropdownVisible(true)}
            className="form-input text-center px-1 mb-2 w-full"
          />
          {challengedDropdownVisible && (
            <div
              ref={challengedDropdownRef}
              className="absolute z-10 mt-1 w-full bg-white rounded border border-gray-300 shadow-md"
            >
              {/* Dropdown items */}
              {challengedSearchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded border border-gray-300 shadow-md">
                  {/* Dropdown items */}
                  {challengedSearchResults.map((result) => (
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
              <label
                htmlFor="challenged_state_rank"
                className="text-white mr-3"
              >
                State Rank
              </label>
              <input
                id="challenged_state_rank"
                type="number"
                name="challenged_state_rank"
                placeholder="0"
                value={parseInt(newMatch.challenged_state_rank)}
                onChange={handleChange}
                className="form-input px-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="challenged_world_rank" className="text-white">
                World Rank
              </label>
              <input
                id="challenged_world_rank"
                type="number"
                name="challenged_world_rank"
                placeholder="0"
                value={parseInt(newMatch.challenged_world_rank)}
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
          {/* Custom styled radio buttons */}
          <div
            className={`rounded-md py-4  bg-primary-red flex justify-center items-center cursor-pointer ${
              selectedSets === 1 && "bg-primary-yellow text-black"
            }`}
            onClick={() => handleSetSelection(1)}
          >
            <span
              className={`text-white ${selectedSets === 1 && "text-black"}`}
            >
              1 set of 1
            </span>
          </div>
          <div
            className={`rounded-md py-4 bg-primary-red flex justify-center items-center cursor-pointer ${
              selectedSets === 2 && "bg-primary-yellow text-black"
            }`}
            onClick={() => handleSetSelection(2)}
          >
            <span
              className={`text-white ${selectedSets === 2 && "text-black"}`}
            >
              2 sets of 3
            </span>
          </div>
          <div
            className={`rounded-md py-4 bg-primary-red flex justify-center items-center cursor-pointer ${
              selectedSets === 3 && "bg-primary-yellow text-black"
            }`}
            onClick={() => handleSetSelection(3)}
          >
            <span
              className={`text-white ${selectedSets === 3 && "text-black"}`}
            >
              3 sets of 5
            </span>
          </div>
          <div
            className={`rounded-md py-4 bg-primary-red flex justify-center items-center cursor-pointer ${
              selectedSets === 4 && "bg-primary-yellow text-black"
            }`}
            onClick={() => handleSetSelection(4)}
          >
            <span
              className={`text-white ${selectedSets === 4 && "text-black"}`}
            >
              4 sets of 7
            </span>
          </div>
        </div>
      </fieldset>

      <div className="flex flex-col items-center col-span-2 mt-6 gap-y-2">
        <button
          type="submit"
          className="bg-primary-yellow text-black text-xl font-bold py-5 w-[90%] rounded"
        >
          Create New Match
        </button>
        <HomeButton />
      </div>
    </form>
  );
}
