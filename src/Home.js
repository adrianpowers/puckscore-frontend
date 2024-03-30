import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="flex flex-col justify-center items-center w-full h-screen bg-primary-blue font-custom">
      <h1 className="text-4xl font-bold text-white text-center m-6">
        Welcome to 
        <br/>North Carolina 
        <br/>Puckscore!  
      </h1>
      <div className="flex flex-col justify-center items-center mt-6 gap-y-3">
        <Link to="newmatch">
          <button className="bg-primary-red text-white text-xl rounded-full w-72 h-24">
            <b>Create New Match</b>
          </button>
        </Link>
        <Link to="matches">
          <button className="bg-primary-yellow text-xl rounded-full w-72 h-12 mt-8">
            View All Matches
          </button>
        </Link>
        <Link to="rankings">
          <button className="bg-primary-red text-white text-xl rounded-full w-72 h-12">
            View Current Rankings
          </button>
        </Link>
      </div>
    </section>
  );
}
