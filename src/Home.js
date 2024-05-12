import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="flex flex-col justify-center items-center w-full h-screen bg-primary-blue font-custom">
      <h1 className="text-4xl font-bold text-white text-center m-6">
        Welcome to 
        <br/>North Carolina 
        <br/>Puckscore!  
      </h1>
      <section id="buttons" className="text-center mt-6">
        <Link to="newmatch">
          <button className="bg-primary-red text-white text-xl rounded-full w-[75%] h-[80%]">
            <b>Create New Match</b>
          </button>
        </Link>
        <Link to="matches">
          <button className="bg-primary-yellow text-xl rounded-full w-[75%] h-[40%] mt-8 mb-2">
            View All Matches
          </button>
        </Link>
        <Link to="rankings">
          <button className="bg-primary-red text-white text-xl rounded-full w-[75%] h-[40%]">
            Rankings and Player Data
          </button>
        </Link>
      </section>
    </section>
  );
}
