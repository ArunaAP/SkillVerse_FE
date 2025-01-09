import React from 'react';

export default function BriefCard({ title, description }) {
  // Truncate description to a maximum of 100 characters
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div
      className="bg-[#D9D9D9] shadow-md rounded-lg p-4 flex flex-col justify-between"
      style={{ height: '200px' }} // Fixed height
    >
      <div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600">
          {truncateText(description, 500)} {/* Truncated description */}
        </p>
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="bg-[#0057FF] text-white py-2 px-4 rounded-full hover:bg-blue-600 transition"
        >
          Read full brief
        </button>
      </div>
    </div>
  );
}
