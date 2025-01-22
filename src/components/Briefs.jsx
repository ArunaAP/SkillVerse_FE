import React, { useState, useEffect } from "react";
import BriefCard from "./BriefCard";
import Navbar from "./Navbar";
import Footer from "./Footer";

const BriefsPage = () => {
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch briefs from the backend
  useEffect(() => {
    const fetchBriefs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/brief");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch briefs");
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
      setBriefs((prevBriefs) =>
        prevBriefs.filter((brief) => brief._id !== briefId)
      );
      console.log(`Brief with ID ${briefId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting brief:", error.message);
      alert("Failed to delete the brief. Please try again.");
    }
  };

  // Render loading, error, or briefs
  return (
    <div>
      <section className="relative flex items-center justify-between max-w-7xl z-20 mx-auto md:px-12">
        <div className="fixed top-80 left-30 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue rounded-full opacity-40 z-0 blur-[90px]"></div>
        <div className="fixed top-3/4 right-60 transform -translate-x-1/ -translate-y-1/3 w-[300px] h-[300px] bg-blue rounded-full opacity-70 z-0 blur-[100px]"></div>

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
