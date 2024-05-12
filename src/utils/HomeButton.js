import React from "react";
import { Link } from "react-router-dom";

export default function HomeButton() {
  return (
    <Link to="/">
      <button className="bg-primary-red text-white font-bold rounded h-12 w-[45%] mb-2">
        Home
      </button>
    </Link>
  );
}
