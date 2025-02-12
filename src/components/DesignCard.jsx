import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export default function DesignCard({
  designId,
  image,
  title,
  designer,
  likes,
  createdAt,
}) {
  const navigate = useNavigate();
  const [designerName, setDesignerName] = useState("Loading...");
  const [designerImg, setDesignerImg] = useState("");

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  useEffect(() => {
    const fetchDesignerName = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/users/${designer}`);
        if (!response.ok) {
          throw new Error("Failed to fetch designer data");
        }
        const data = await response.json();
        setDesignerName(data.fullname || "Unknown Designer");
        setDesignerImg(data.profileImage || "");
      } catch (error) {
        console.error("Error fetching designer data:", error);
        setDesignerName("Unknown Designer");
      }
    };

    if (designer) {
      fetchDesignerName();
    }
  }, [designer]);

  const handleDesignerClick = (event) => {
    event.stopPropagation();
    navigate(`/portfolio/${designer}`);
  };

  const handleCardClick = () => {
    navigate(`/design/${designId}`);
  };

  return (
    <div
      className="bg-white rounded-lg overflow-hidden cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative w-full h-60">
        <img src={image} alt={title} className="object-cover w-full h-full" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-800 via-transparent to-transparent h-60 opacity-0 group-hover:opacity-80 transition-opacity">
          <p className="text-white text-md font-bold absolute bottom-4 left-4">
            {title}
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="py-3 flex justify-between items-center">
        {/* Left Section: Designer */}
        <div className="flex items-center px-2">
          <img
            src={designerImg}
            alt={designerName}
            className="w-5 h-5 rounded-full mr-2"
          />
          <p
            className="text-gray-500 text-sm cursor-pointer hover:underline"
            onClick={handleDesignerClick}
          >
            {designerName}
          </p>
          <p className="px-2 text-gray-400">•</p>
          {/* Time */}
          <p className="text-gray-400 text-sm">{timeAgo}</p>
        </div>

        {/* Right Section: Likes and Time */}
        <div className="flex flex-col items-end ml-auto space-y-2 px-2">
          {/* Likes */}
          <div className="flex items-center space-x-1">
            <span className="text-gray-400 text-sm font-medium">{likes}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5 text-gray-400"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
