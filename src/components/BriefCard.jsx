import React from 'react';
import { useNavigate } from 'react-router-dom';

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

  // Truncate description to a maximum of 100 characters
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleCardClick = () => {
    navigate(`/brief/${briefId}`);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/brief/${briefId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        onDelete(briefId); // Call onDelete function passed from parent to update the state
      } else {
        alert("Failed to delete brief");
      }
    } catch (error) {
      console.error("Error deleting brief:", error);
      alert("Error deleting brief");
    }
  };

  const handleUpdate = ()=>{
    navigate(`/update-brief/${briefId}`)
  }

  return (
    <div
      className="bg-[#F5F5F5]  rounded-lg p-4 flex flex-col justify-between"
      style={{ height: '200px' }} // Fixed height
    >
      <div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600">
          {truncateText(description, 80)} {/* Truncated description */}
        </p>
      </div>
      <div className="flex justify-end mt-4 gap-2">
        {/* Read Full Brief Button */}
        <button
          className="text-blue py-1 px-4 rounded-full hover:text-gray transition"
          onClick={handleCardClick}
        >
          Read full brief
        </button>

        {/* Delete Button for Admin */}
        {role === 'Admin' && (
          <>
          <button
            className="text-red-600 py-2 px-4 rounded-full hover:text-red-700 transition"
            onClick={handleDelete}
          >
           <i className="fa-solid fa-trash"></i>
          </button>
          
          <button
            className="text-blue py-2 px-4 rounded-full hover:text-gray-600 transition"
            onClick={handleUpdate}
          >
          <i class="fa-solid fa-pen"></i>
          </button>

          </>
        )}
      </div>
    </div>
  );
}
