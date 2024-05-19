import React from "react";
import { Link } from "react-router-dom";

export default function HomeButton() {
  return (
    <Link to="/">
      <button className="bg-primary-red hover:bg-primary-blue text-white font-bold rounded h-12 w-[45%] mb-2 shadow-xl transition ease-in-out duration-200">
        Home
      </button>
    </Link>
  );
}
