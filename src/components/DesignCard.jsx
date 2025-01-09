import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function DesignCard({ designId ,image, title, designer, likes, createdAt }) {

  const navigate = useNavigate();
  // Convert the createdAt time to a JavaScript Date object and calculate "time ago"
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  const designerId = designer;

  const handleDesignerClick = () => {
    navigate(`/portfolio/${designerId}`);
  };

  const handleCardClick = () => {
    navigate(`/design/${designId}`);
  };

  return (
    
    <div className="bg-white  rounded-lg overflow-hidden cursor-pointer" onClick={handleCardClick}>
      
      {/* Image Section */}
      <div className="relative w-full h-60">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Bottom Section */}
      <div className="p-4 flex justify-between items-center">
        {/* Left Section: Title and Designer */}
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p
            className="text-gray-500 text-sm cursor-pointer hover:underline"
            onClick={handleDesignerClick}
          >{designer}</p>
        </div>

        {/* Right Section: Likes and Time */}
        <div className="flex flex-col items-end ml-auto space-y-2">
          {/* Likes */}
          <div className="flex items-center space-x-1">
            <span className="text-black text-sm font-medium">{likes}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5 text-black"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          {/* Time */}
          <p className="text-gray-400 text-sm">{timeAgo}</p>
        </div>
      </div>
    </div>
  );
}
