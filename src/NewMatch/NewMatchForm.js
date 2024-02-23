import React from "react";

export default function NewMatchForm({ newMatch, handleChange, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <div className="flex justify-evenly">
        {/* Challenger (Player 1) */}
        <div>
          <label htmlFor="challenger_name" className="block text-white">
            Challenger Name
          </label>
          <input
            required
            id="challenger_name"
            type="text"
            name="challenger_name"
            placeholder="Challenger Name"
            value={newMatch.challenger_name}
            onChange={handleChange}
            className="form-input px-1"
          />

          <label
            htmlFor="challenger_state_rank"
            className="block mt-4 text-white"
          >
            Challenger State Rank
          </label>
          <input
            id="challenger_state_rank"
            type="number"
            name="challenger_state_rank"
            placeholder="0"
            value={parseInt(newMatch.challenger_state_rank)}
            onChange={handleChange}
            className="form-input px-1"
          />

          <label
            htmlFor="challenger_world_rank"
            className="block mt-4 text-white"
          >
            Challenger World Rank
          </label>
          <input
            id="challenger_world_rank"
            type="number"
            name="challenger_world_rank"
            placeholder="0"
            value={parseInt(newMatch.challenger_world_rank)}
            onChange={handleChange}
            className="form-input px-1"
          />
        </div>

        {/* Challenged (Player 2) */}
        <div>
          <label htmlFor="challenged_name" className="block text-white">
            Challenged Name
          </label>
          <input
            required
            id="challenged_name"
            type="text"
            name="challenged_name"
            placeholder="Challenged Name"
            value={newMatch.challenged_name}
            onChange={handleChange}
            className="form-input px-1"
          />

          <label
            htmlFor="challenged_state_rank"
            className="block mt-4 text-white"
          >
            Challenged State Rank
          </label>
          <input
            id="challenged_state_rank"
            type="number"
            name="challenged_state_rank"
            placeholder="0"
            value={parseInt(newMatch.challenged_state_rank)}
            onChange={handleChange}
            className="form-input px-1"
          />

          <label
            htmlFor="challenged_world_rank"
            className="block mt-4 text-white"
          >
            Challenged World Rank
          </label>
          <input
            id="challenged_world_rank"
            type="number"
            name="challenged_world_rank"
            placeholder="0"
            value={parseInt(newMatch.challenged_world_rank)}
            onChange={handleChange}
            className="form-input px-1"
          />
        </div>
      </div>

      <fieldset className="col-span-2 mt-4 text-center flex justify-center">
        <legend className="text-2xl text-white font-bold mb-3 text-center">
          Number of Sets
        </legend>
        <div className="flex space-x-4">
          {/* Custom styled radio buttons */}
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="sets_to_win"
              value="1"
              onChange={handleChange}
              checked={newMatch.sets_to_win === 1}
              className="form-radio h-4 w-4 text-primary-red"
            />
            <span className="ml-2 text-white">1 set of 1</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="sets_to_win"
              value="2"
              onChange={handleChange}
              checked={newMatch.sets_to_win === 2}
              className="form-radio h-4 w-4 text-primary-red"
            />
            <span className="ml-2 text-white">2 sets of 3</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="sets_to_win"
              value="3"
              onChange={handleChange}
              checked={newMatch.sets_to_win === 3}
              className="form-radio h-4 w-4 text-primary-red"
            />
            <span className="ml-2 text-white">3 sets of 5</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="sets_to_win"
              value="4"
              onChange={handleChange}
              checked={newMatch.sets_to_win === 4}
              className="form-radio h-4 w-4 text-primary-red"
            />
            <span className="ml-2 text-white">4 sets of 7</span>
          </label>
        </div>
      </fieldset>

      {/* Center the "Create Match" button */}
      <div className="col-span-2 mt-4 flex justify-center">
        <button
          type="submit"
          className="bg-primary-red text-white font-bold py-2 px-4 rounded"
        >
          Create Match
        </button>
      </div>
    </form>
  );
}
