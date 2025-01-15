import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  // Parse the token and extract the fullname and role
  const token = localStorage.getItem("token");
  const userData = token
    ? (() => {
        try {
          const tokenPayload = JSON.parse(atob(token.split(".")[1]));
          return {
            fullname: tokenPayload?.fullname || null,
            profileImage: tokenPayload?.profileImage || null,
            role: tokenPayload?.role || null,
          };
        } catch (error) {
          console.error("Error parsing token:", error);
          return { fullname: null, profileImage: null, role: null };
        }
      })()
    : { fullname: null, profileImage: null,  role: null };

  const { fullname, profileImage, role } = userData;

  const profileImg = profileImage || "https://cdn-icons-png.flaticon.com/512/8847/8847419.png";

  const handleSignOut = (e) => {
    e.stopPropagation(); // Prevent dropdown from closing if clicked here
    localStorage.removeItem("token"); // Clear token
    navigate("/login"); // Redirect to login page
  };

  const handleDropdownToggle = (e) => {
    e.stopPropagation(); // Prevent parent click events
    setDropdownVisible((prev) => !prev); // Toggle dropdown visibility
  };

  useEffect(() => {
    const handleOutsideClick = () => {
      setDropdownVisible(false); // Hide dropdown when clicking outside
    };

    // Attach event listener for outside clicks
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick); // Cleanup
    };
  }, []);

  return (
    <div className="relative top-0 left-0 w-full z-30 bg-transparent">
      <div className="flex justify-between items-center max-w-7xl mx-auto py-4 px-6 md:px-12">
        {/* Logo */}
        <div className="text-xl font-bold text-black">
          <Link to="/" className="cursor-pointer">
            Skill<span className="text-primary">Verse</span>
          </Link>
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

        {/* User Section */}
        <div className="relative flex items-center gap-4">
          {token ? (
            <div className="relative flex items-center gap-2">
              {/* User Greeting */}
              <span className="text-black font-medium">Hello, {fullname}</span>
              <img
                src={profileImg}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
                onClick={handleDropdownToggle}
              />

              {/* Dropdown Menu */}
              {dropdownVisible && (
                <div
                  className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md py-2 w-32 text-sm z-50"
                  onClick={(e) => e.stopPropagation()} // Prevent dropdown close on click inside
                >
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                  {role === "Admin" && (
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate("/add-brief")}
                    >
                      Add Brief
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Login and Signup Buttons */}
              <Link to="/login">
                <button className="px-6 py-1 bg-blue text-white rounded-full hover:bg-white hover:text-blue hover:border hover:border-blue transition">
                  LOG IN
                </button>
              </Link>
              <Link to="/register">
              <button className="px-6 py-1 border border-blue text-blue rounded-full hover:bg-blue hover:text-white transition">
                SIGN UP
              </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
