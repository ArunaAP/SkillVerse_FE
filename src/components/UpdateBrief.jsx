import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BriefForm from "./BriefForm";
import BriefCard from "./BriefCard";

const apiUrl = import.meta.env.VITE_API_URL;

const UpdateBrief = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [brief, setBrief] = useState(null);
  const [recentBriefs, setRecentBriefs] = useState([]);
  const { briefId } = useParams();
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

  useEffect(() => {
    const fetchBrief = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/brief/${briefId}`);
        const data = await response.json();
        setBrief(data);
      } catch (err) {
        setError("Failed to fetch brief");
      }
    };

    fetchBrief();
  }, [briefId]);

  const handleSubmit = async (e, formData) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch(`${apiUrl}/api/brief/${briefId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update brief: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Brief updated successfully:");
      navigate("/briefs");
    } catch (err) {
      console.error("Error updating brief:", err);
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

      const response = await fetch(`${apiUrl}/api/brief/${briefId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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

  if (!brief) return <p>Loading brief...</p>;

  return (
    <section className="relative flex items-center justify-between max-w-7xl z-20 mx-auto md:px-12">
      <div className="max-w-7xl mx-auto py-6 bg-white rounded-lgmt-10 flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 pr-6">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">
            Update Brief
          </h1>

          <BriefForm
            initialData={brief} // Pass the existing brief data
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

export default UpdateBrief;
