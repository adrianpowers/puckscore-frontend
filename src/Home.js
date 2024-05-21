import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="flex flex-col justify-center items-center w-full h-screen bg-gradient-to-b from-secondary-blue to-tertiary-blue font-custom">
      <h1 className="text-4xl font-bold text-white text-center m-6">
        Welcome to <br />North Carolina <br />Puckscore!
      </h1>
      <div id="buttons" className="text-center mt-6">
        <div className="flex flex-col space-y-4">
          <Link to="newmatch">
            <button className="bg-primary-red hover:bg-primary-blue text-white text-xl rounded w-[100%] h-24 shadow-md transition ease-in-out duration-200">
              <b>Create New Match</b>
            </button>
          </Link>
          <Link to="matches">
            <button className="mt-6 bg-primary-yellow hover:bg-primary-red hover:text-white text-xl rounded w-[100%] h-16 p-4 shadow-xl transition ease-in-out duration-200">
              View All Matches
            </button>
          </Link>
          <Link to="players">
            <button className="bg-primary-red hover:bg-primary-blue text-white text-xl rounded w-[100%] h-16 p-4 shadow-xl transition ease-in-out duration-200">
              Rankings and Player Data
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
