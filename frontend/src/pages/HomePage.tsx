import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      <main className="grow flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to My Blog
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Discover the latest articles and insights on various topics. Explore
            our collection of blog posts and stay informed.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/blogs"
              className="bg-gray-800 text-white py-2 px-6 rounded hover:bg-gray-700 transition duration-300"
            >
              Explore Posts
            </Link>
            {/* <button className="bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300 transition duration-300">Learn More</button> */}
          </div>
        </div>
      </main>

      {/* <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; 2023 My Blog. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default HomePage;
