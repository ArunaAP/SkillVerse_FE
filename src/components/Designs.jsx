import React, { useState, useEffect } from 'react';
import DesignCard from './DesignCard';
import Navbar from './Navbar';
import Footer from './Footer';

const Designs = () => {
  const [designs, setDesigns] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(''); 

  // Fetch designs from the backend
  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/design'); 
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch designs');
        }

        setDesigns(data); 
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchDesigns();
  }, []);

  return (
    <div>
      <section className="relative flex flex-col max-w-7xl z-20 mx-auto py-12 px-6 md:px-12">
        <h1 className="text-3xl font-bold mb-6">All Designs</h1>

        {/* Show loading or error */}
        {loading && <p>Loading designs...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Render designs in a grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => (
            <DesignCard
              key={design._id}
              designId={design._id}
              image={design.image}
              title={design.title}
              designer={design.designer} 
              likes={design.likes}
              createdAt={design.createdAt}
            />
          ))}
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default Designs;
