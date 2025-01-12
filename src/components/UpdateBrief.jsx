import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BriefForm from './BriefForm';

const UpdateBrief = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [brief, setBrief] = useState(null);
  const { briefId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrief = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/brief/${briefId}`);
        const data = await response.json();
        setBrief(data);
      } catch (err) {
        setError('Failed to fetch brief');
      }
    };

    fetchBrief();
  }, [briefId]);

  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const response = await fetch(`http://localhost:5000/api/brief/${briefId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update brief: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Brief updated successfully:');
      navigate('/briefs');
    } catch (err) {
      console.error('Error updating brief:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!brief) return <p>Loading brief...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Update Brief</h1>
      <BriefForm
        initialData={brief}  // Pass the existing brief data
        handleSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default UpdateBrief;
