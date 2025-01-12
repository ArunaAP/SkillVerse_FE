import React, { useState, useEffect } from 'react';

const BriefForm = ({ initialData, handleSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
  });

  useEffect(() => {
    if (initialData) {
      // Convert the deadline to the required format (YYYY-MM-DD)
      const formattedDeadline = formatDate(initialData.deadline);

      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        deadline: formattedDeadline || '', // Use the formatted deadline
      });
    }
  }, [initialData]);

  // Function to format date to YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return '';

    // If the date is in MM/DD/YYYY format, convert it to YYYY-MM-DD
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate)) {
      return parsedDate.toISOString().split('T')[0];
    }
    return date; // If it's already in the correct format, return it
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, formData)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-gray font-medium mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-gray font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          className="w-full px-4 py-2 border border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
        ></textarea>
      </div>
      <div>
        <label htmlFor="deadline" className="block text-gray font-medium mb-2">
          Deadline
        </label>
        <input
          type="date"
          id="deadline"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className={`py-2 px-4 text-white bg-blue rounded-full focus:outline-none hover:bg-blue ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Save Brief'}
        </button>
      </div>
      {error && <p className="text-red mt-4">{error}</p>}
    </form>
  );
};

export default BriefForm;
