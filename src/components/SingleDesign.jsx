import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const SingleDesignPage = () => {
  const { designId } = useParams(); 
  const [design, setDesign] = useState(null);

  
  // Fetch the design data by ID
  useEffect(() => {
      fetch(`http://localhost:5000/api/design/${designId}`)
      .then((response) => response.json())
      .then((data) => setDesign(data))
      .catch((error) => console.error("Error fetching design data:", error));
    }, [designId]);
    
    if (!design) {
        return <div>Loading design details...</div>;
    }
    const timeAgo = formatDistanceToNow(new Date(design.createdAt), { addSuffix: true });
    
  return (
    <section className="relative flex items-center justify-between max-w-7xl z-20 mx-auto md:px-12">
    <div className="container mx-auto  py-8">
      {/* Back Link */}
      <a href="/designs" className="text-blue-600 hover:underline">
        &lt; All Designs
      </a>
      <h1 className="text-3xl font-bold mt-4">{design.title}</h1>


      <div className="flex flex-col md:flex-row items-center justify-between mt-8">
        {/* Left: Design Image */}
        <div className="flex-1">
          <img
            src={design.image || 'https://via.placeholder.com/600'}
            alt={design.title}
            className="rounded-lg shadow"
          />
        </div>

       {/* Right: Design Details */}
<div className="flex-1 bg-gray-100 p-6 rounded-lg shadow ml-4 relative">
  {/* Time Ago - Top Right Corner */}
  <p className="text-gray-500 text-sm absolute top-4 right-4">{timeAgo}</p>

  {/* Designer Name */}
  <p className="text-gray-600">{design.designer}</p>
  
  {/* Description */}
  <p className="mt-4 text-gray-700">{design.description}</p>

  {/* Likes - Bottom Right Corner */}
  <div className="absolute bottom-4 right-4 flex items-center space-x-1">
    <span className="text-black text-sm font-medium">{design.likes}</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="w-5 h-5 text-black"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  </div>
</div>

      </div>
    </div>
    </section>
  );
};

export default SingleDesignPage;
