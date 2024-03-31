import React from "react";
import { Link } from "react-router-dom";

export default function HomeButton() {
  return (
    <Link to="/">
      <button className="bg-primary-red text-white text-xl rounded h-12 w-28 mb-2">
        Home
      </button>
    </Link>
  );
}
