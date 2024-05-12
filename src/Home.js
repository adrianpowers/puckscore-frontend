import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="flex flex-col justify-center items-center w-full h-screen bg-primary-blue font-custom">
      <h1 className="text-4xl font-bold text-white text-center m-6">
        Welcome to <br />North Carolina <br />Puckscore!
      </h1>
      <div id="buttons" className="text-center mt-6">
        <div className="flex flex-col space-y-4">
          <Link to="newmatch">
            <button className="bg-primary-red text-white text-xl rounded w-[100%] h-24 shadow-md">
              <b>Create New Match</b>
            </button>
          </Link>
          <Link to="matches">
            <button className="mt-6 bg-primary-yellow text-xl rounded w-[100%] h-16 p-4 shadow-xl">
              View All Matches
            </button>
          </Link>
          <Link to="rankings">
            <button className="bg-primary-red text-white text-xl rounded w-[100%] h-16 p-4 shadow-xl">
              Rankings and Player Data
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
