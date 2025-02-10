import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { jwtDecode } from "jwt-decode";
import Footer from "./Footer";
const apiUrl = import.meta.env.VITE_API_URL;

const SingleDesignPage = () => {
  const { designId } = useParams();
  const [design, setDesign] = useState(null);
  const [designer, setDesigner] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const navigate = useNavigate();

  // Fetch the design data by ID
  useEffect(() => {
    fetch(`${apiUrl}/api/design/${designId}`)
      .then((response) => response.json())
      .then((data) => {
        setDesign(data);
        setIsLiked(data.likedBy?.includes(localStorage.getItem("userId"))); // Check if the user already liked the design
      })
      .catch((error) => console.error("Error fetching design data:", error));
  }, [designId]);

  // Fetch the designer data by designer ID (only when design is available)
  useEffect(() => {
    if (design && design.designer) {
      fetch(`${apiUrl}/api/users/${design.designer}`)
        .then((response) => response.json())
        .then((data) => setDesigner(data))
        .catch((error) =>
          console.error("Error fetching designer data:", error)
        );
    }
  }, [design]);

  // Check if the user is logged in (JWT token in localStorage)
  const isLoggedIn = localStorage.getItem("token") !== null;

  // Handle Like button click
  const handleLikeClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to like the design");
      return;
    }

    const decodedToken = jwtDecode(token); // Decode the JWT token
    const userId = decodedToken.id; // Get the user ID from the decoded token

    fetch(`${apiUrl}/api/design/${designId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDesign(data); // Update the design with the new like count
        setIsLiked(true); // Set the flag to indicate the design is liked
      })
      .catch((error) => console.error("Error liking the design:", error));
  };

  if (!design) {
    return <div>Loading design details...</div>;
  }

  const handleDesignerClick = (event) => {
    event.stopPropagation();
    navigate(`/portfolio/${design.designer}`);
  };

  const timeAgo = formatDistanceToNow(new Date(design.createdAt), {
    addSuffix: true,
  });

  return (
    <div>
      <section className="relative flex items-center justify-between max-w-7xl z-20 mx-auto md:px-12">
        <div className="container mx-auto py-8">
          {/* Back Link */}
          <a href="/designs" className="text-blue hover:underline">
            &lt; All Designs
          </a>
          <h1 className="text-3xl font-bold mt-4 py-5">{design.title}</h1>

          <hr className="py-5" />

          <div className="flex flex-col md:flex-row justify-between mt-5">
            {/* Left: Design Image */}
            <div className="flex-1">
              <img
                src={design.image || "https://via.placeholder.com/600"}
                alt={design.title}
                className="w-[500px] rounded-lg shadow"
              />
            </div>

            {/* Right: Design Details */}
            <div className="flex-1 bg-gray-100 p-6 h-auto rounded-lg shadow ml-4 relative">
              {/* Time Ago - Top Right Corner */}
              <p className="text-gray-500 text-sm absolute top-4 right-4">
                {timeAgo}
              </p>

              {/* Designer Name */}
              <div
                className="flex items-center cursor-pointer"
                onClick={handleDesignerClick}
              >
                <img
                  src={designer ? designer.profileImage : "Loading..."}
                  alt={designer ? designer.profileImage : "Loading..."}
                  className="w-7 h-7 rounded-full mr-2"
                />
                <p className="text-gray-600 text-lg cursor-pointer hover:underline">
                  {designer ? designer.fullname : "Loading..."}
                </p>
              </div>

              {/* Description */}
              <p className="mt-4 text-gray-700">{design.description}</p>

              {/* Likes - Bottom Right Corner */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-1">
                <span className="text-black text-sm font-medium">
                  {design.likes}
                </span>
                <button
                  onClick={handleLikeClick}
                  disabled={isLiked}
                  className={`w-5 h-5 ${
                    isLiked ? "text-red-500" : "text-black"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SingleDesignPage;
