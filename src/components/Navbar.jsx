import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Navbar = () => {
  return (
    <div className="absolute top-0 left-0 w-full z-20">
      <div className="flex justify-between items-center max-w-7xl mx-auto py-4 px-6 md:px-12">
        {/* Logo */}
        <div className="text-xl font-bold text-black">LOGO</div>

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-7 text-black font-medium">
          <Link to="/" className="cursor-pointer hover:text-gray">
            Home
          </Link>
          <Link to="/briefs" className="cursor-pointer hover:text-neutral-400">
            Briefs
          </Link>
          <Link to="/designs" className="cursor-pointer hover:text-neutral-400">
            Designs
          </Link>
          <Link to="/community" className="cursor-pointer hover:text-neutral-400">
            Community
          </Link>
        </ul>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <Link to="/login">
            <button className="hidden md:block px-6 py-1 bg-blue text-white rounded-full hover:bg-white hover:text-blue hover:border hover:border-blue transition">
              LOG IN
            </button>
          </Link>
          <button className="hidden md:block px-6 py-1 border border-blue text-blue rounded-full hover:bg-blue hover:text-white transition">
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
