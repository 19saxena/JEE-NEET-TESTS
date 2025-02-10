import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold">Welcome to JEE/NEET Tests</h1>
      <p className="mt-4">Take tests, track your progress, and ace your exams!</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/examtype?examType=JEE">
          <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 transition cursor-pointer">
            <h2 className="text-xl font-semibold">Start JEE Test</h2>
            <p>Select subjects and start testing your knowledge.</p>
          </div>
        </Link>

        <Link to="/examtype?examType=NEET">
          <div className="bg-green-500 text-white p-4 rounded-lg shadow-md hover:bg-green-600 transition cursor-pointer">
            <h2 className="text-xl font-semibold">Start NEET Test</h2>
            <p>Challenge yourself with NEET questions.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
