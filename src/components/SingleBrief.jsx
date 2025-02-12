import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "./Footer";
import DesignCard from "./DesignCard";
const apiUrl = import.meta.env.VITE_API_URL;

const BriefPage = () => {
  const navigate = useNavigate();
  const { briefId } = useParams();

  const [brief, setBrief] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the brief data
    const fetchBrief = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/brief/${briefId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch the brief.");
        }
        const data = await response.json();
        setBrief(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrief();
  }, [briefId]);

  useEffect(() => {
    // Fetch all designs and filter by briefId
    const fetchDesigns = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/design/`);
        if (!response.ok) {
          throw new Error("Failed to fetch designs.");
        }
        const data = await response.json();
        const filteredDesigns = data.filter(
          (design) => design.brief === briefId
        );
        setDesigns(filteredDesigns);
      } catch (err) {
        console.error("Error fetching designs:", err.message);
      }
    };

    fetchDesigns();
  }, [briefId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleSubmitDesign = () => {
    navigate(`/add-design/${briefId}`);
  };

  return (
    <div>
      <section className="relative flex items-center justify-between max-w-7xl z-20 mx-auto md:px-12">
        <div className="container mx-auto py-8 min-h-screen">
          <div className="mb-6">
            <a href="/briefs" className="text-blue hover:underline text-sm">
              &lt; All Briefs
            </a>
            <h1 className="text-3xl font-bold mt-4 py-5">{brief.title}</h1>

            <hr className="py-5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 pr-20 pl-8">
              <h2 className="text-lg font-bold mb-2">Brief</h2>
              <p className="text-gray-800 leading-relaxed">
                {brief.description}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md shadow-md">
              <h2 className="text-lg font-bold mb-2">Deliverables</h2>
              <p>Deadline: {brief.deadline}</p>

              <button
                className={`py-2 px-4 text-white bg-blue rounded-full focus:outline-none hover:bg-blue`}
                onClick={handleSubmitDesign}
              >
                Submit work
              </button>
            </div>
          </div>
          <div className="mt-20">
            <h3 className="text-xl font-bold mt-4 py-5">
              Recent Work by Other Users
            </h3>
            <hr className="py-5" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {designs.length > 0 ? (
                designs.map((design) => (
                  <DesignCard
                    key={design._id}
                    designId={design._id}
                    image={design.image || "https://via.placeholder.com/150"}
                    title={design.title}
                    designer={design.designer}
                    likes={design.likes}
                    createdAt={design.createdAt}
                  />
                ))
              ) : (
                <p>No recent work available for this brief.</p>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BriefPage;
