import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="flex flex-col justify-center items-center w-full h-screen bg-primary-blue font-custom">
      <h1 className="text-4xl font-bold text-white m-6">
        Welcome to Puckscore!  
      </h1>
      <div className="flex justify-center mx-6 p-2">
        <Link to="newmatch">
          <button className="bg-primary-red text-white text-xl px-3 py-2 mb-2 rounded-full w-40 mr-1">
            New Match
          </button>
        </Link>
        <Link to="matches">
          <button className="bg-primary-yellow text-xl px-3 py-2 mb-2 rounded-full w-52 ml-1">
            View All Matches
          </button>
        </Link>
        <Link to="rankings">
          <button className="bg-primary-red text-white text-xl px-3 py-2 mb-2 rounded-full w-52 ml-1">
            Current Rankings
          </button>
        </Link>
      </div>
    </section>
  );
}
