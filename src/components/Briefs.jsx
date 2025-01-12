import React, { useState, useEffect } from 'react';
import BriefCard from './BriefCard';
import Navbar from './Navbar';
import Footer from './Footer';

const BriefsPage = () => {
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch briefs from the backend
  useEffect(() => {
    const fetchBriefs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/brief');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch briefs');
        }

        setBriefs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBriefs();
  }, []);

  // Handle deletion of a brief
  const handleDelete = (briefId) => {
    setBriefs(briefs.filter((brief) => brief._id !== briefId)); // Remove the brief from the list
  };

  // Render loading, error, or briefs
  return (
    <div>
      <section className="relative flex items-center justify-between max-w-7xl z-20 mx-auto md:px-12">
        <div className="container mx-auto py-24">
          <h1 className="text-3xl font-bold mb-6">All Briefs</h1>

          {loading && <p>Loading briefs...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {briefs.map((brief) => (
              <BriefCard
                key={brief._id}
                briefId={brief._id}
                title={brief.title}
                description={brief.description}
                onDelete={handleDelete} // Pass the delete handler to BriefCard
              />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BriefsPage;
