import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BriefForm from "./BriefForm";
import BriefCard from "./BriefCard";

const apiUrl = import.meta.env.VITE_API_URL;

const AddBrief = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentBriefs, setRecentBriefs] = useState([]); // State for recently added briefs
  const navigate = useNavigate();

  // Fetch recently added briefs
  useEffect(() => {
    const fetchRecentBriefs = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/brief/recent`);
        if (!response.ok) {
          throw new Error("Failed to fetch recent briefs");
        }
        const data = await response.json();
        setRecentBriefs(data);
      } catch (err) {
        console.error("Error fetching recent briefs:", err);
      }
    };

    fetchRecentBriefs();
  }, []);

  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch("http://localhost:5000/api/brief/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add brief: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Brief added successfully:", result);

      // Fetch updated recent briefs after adding a new one
      setRecentBriefs((prevBriefs) => [result, ...prevBriefs]);

      navigate("/briefs");
    } catch (err) {
      console.error("Error adding brief:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle deletion of a brief
  const handleDelete = async (briefId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch(
        `http://localhost:5000/api/brief/${briefId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the brief.");
      }

      // Remove the deleted brief from the list
      setRecentBriefs((prevBriefs) =>
        prevBriefs.filter((brief) => brief._id !== briefId)
      );
      console.log(`Brief with ID ${briefId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting brief:", error.message);
      alert("Failed to delete the brief. Please try again.");
    }
  };

  return (
    <section className="relative flex items-center justify-between max-w-7xl z-20 mx-auto md:px-12">
      <div className="max-w-7xl mx-auto py-6 bg-white rounded-lgmt-10 flex flex-col md:flex-row">
        {/* Left Section: Add Brief Form */}
        <div className="w-full md:w-2/3 pr-6">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">
            Add a New Brief
          </h1>
          <BriefForm
            initialData={null} // No initial data for Add Brief
            handleSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        </div>

        {/* Right Section: Recently Added Briefs */}
        <div className="w-full md:w-1/3 pl-6 border-l border-gray-200 max-h-max overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Recently Added Briefs
          </h2>
          {recentBriefs.length === 0 ? (
            <p className="text-gray-500">No briefs found.</p>
          ) : (
            <ul className="space-y-4">
              {recentBriefs.map((brief) => (
                <li key={brief._id}>
                  {" "}
                  {/* Place the unique key here */}
                  <BriefCard
                    briefId={brief._id}
                    title={brief.title}
                    description={brief.description}
                    onDelete={handleDelete}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default AddBrief;
