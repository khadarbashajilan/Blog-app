import { Link } from 'react-router-dom';

const NavBar = () => {
  // Assuming you have a way to check if the user is logged in, for example:
  const isLoggedIn = true; // Replace this with your actual logic to check if the user is logged in
  const userName = "John Doe"; // Replace this with the actual user's name

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-center items-center">
        <div className="flex w-full justify-center">
          <div className="flex-1 text-center">
            <Link to="/" className="hover:text-gray-300">Home</Link>
          </div>
          <div className="flex-1 text-center">
            {isLoggedIn ? (
              <span className="hover:text-gray-300">{userName}</span>
            ) : (
              <Link to="/login" className="hover:text-gray-300">Login</Link>
            )}
          </div>
          <div className="flex-1 text-center">
            <Link to="/blogs" className="hover:text-gray-300">Blogs</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;