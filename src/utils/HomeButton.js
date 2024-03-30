import React from "react";
import { Link } from "react-router-dom";

export default function HomeButton() {
  return (
    <Link to="/">
      <button className="bg-primary-red text-white text-xl rounded-full h-12 w-[90%]">
        Home
      </button>
    </Link>
  );
}
