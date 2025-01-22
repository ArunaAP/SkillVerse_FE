import React from "react";
import { useNavigate } from "react-router-dom";

export default function BriefCard({ briefId, title, description, onDelete }) {
  const navigate = useNavigate();

  // Get token and extract the role
  const token = localStorage.getItem("token");
  const userData = token
    ? (() => {
        try {
          const tokenPayload = JSON.parse(atob(token.split(".")[1]));
          return { role: tokenPayload?.role || null };
        } catch (error) {
          console.error("Error parsing token:", error);
          return { role: null };
        }
      })()
    : { role: null };

  const { role } = userData;

  // Truncate description to a maximum of 150 characters
  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleCardClick = () => {
    navigate(`/brief/${briefId}`);
  };

  return (
    <div
      className="bg-white bg-opacity-40 shadow-sm rounded-lg p-4 relative flex flex-col overflow-hidden"
      style={{ height: "200px" }}
    >
      {/* Title and Badges */}
      <div className="mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {/* <div className="flex gap-2 mt-1">
          <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full">Free</span>
          <span className="text-xs text-yellow-800 bg-yellow-200 px-2 py-1 rounded-full">Logo</span>
        </div> */}
      </div>

      {/* Description with Fade */}
      <div className="flex-grow relative">
        <p className="text-sm text-gray-600">
          {truncateText(description, 150)}
        </p>
      </div>

      {/* Footer Section */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-end px-4 py-2 ">
        <button
          className="text-gray-500 text-sm font-medium hover:underline"
          onClick={handleCardClick}
        >
          Read full brief →
        </button>
        {role === "Admin" && (
          <div className="flex items-center gap-2 ml-4">
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => onDelete(briefId)}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => navigate(`/update-brief/${briefId}`)}
            >
              <i className="fa-solid fa-pen"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
