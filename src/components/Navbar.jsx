import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // Check if the user is logged in by verifying the token in localStorage
  const token = localStorage.getItem('token');

  let username = '';
  if (token) {
    try {
      // Parse the token payload and extract the username
      const tokenPayload = JSON.parse(atob(token.split('.')[1])); // Decode the token and get the payload
      username = tokenPayload?.id || ''; // Replace 'id' with the correct user property if available
    } catch (error) {
      console.error('Error parsing token payload:', error);
    }
  }

  return (
    <div className="relative top-0 left-0 w-full z-20 bg-white ">
      <div className="flex justify-between items-center max-w-7xl mx-auto py-4 px-6 md:px-12">
        {/* Logo */}
        <div className="text-xl font-bold text-black">
          Skill<span className="text-primary">Verse</span>
        </div>

        {/* Navigation Links */}
        <ul className="flex gap-7 text-black font-medium">
          <li>
            <Link to="/" className="cursor-pointer hover:text-gray-500">
              Home
            </Link>
          </li>
          <li>
            <Link to="/briefs" className="cursor-pointer hover:text-gray-500">
              Briefs
            </Link>
          </li>
          <li>
            <Link to="/designs" className="cursor-pointer hover:text-gray-500">
              Designs
            </Link>
          </li>
          <li>
            <Link to="/community" className="cursor-pointer hover:text-gray-500">
              Community
            </Link>
          </li>
        </ul>

        {/* Buttons or Username */}
        <div className="flex items-center gap-4">
          {token ? (
            <p className="text-black">Hello, {username}</p> // Display username if logged in
          ) : (
            <>
              <Link to="/login">
                <button className="px-6 py-1 bg-blue text-white rounded-full hover:bg-white hover:text-blue hover:border hover:border-blue transition">
                  LOG IN
                </button>
              </Link>
              <button className="px-6 py-1 border border-blue text-blue rounded-full hover:bg-blue hover:text-white transition">
                SIGN UP
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
