import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BriefForm from './BriefForm';

const AddBrief = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const response = await fetch('http://localhost:5000/api/brief/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add brief: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Brief added successfully:');
      navigate('/briefs');
    } catch (err) {
      console.error('Error adding brief:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Add a New Brief</h1>
      <BriefForm
        initialData={null}  // No initial data for Add Brief
        handleSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default AddBrief;
