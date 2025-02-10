import React, { useEffect, useState } from "react";
import Hero from "./Hero";
import Search from "./Search";
import BriefCard from "./BriefCard";
import DesignCard from "./DesignCard";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Home() {
  const [briefs, setBriefs] = useState([]);
  const [designs, setDesigns] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBriefs = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/brief/`);
        const data = await response.json();
        setBriefs(data);
      } catch (error) {
        console.error("Failed to fetch briefs:", error);
      }
    };
    const fetchDesigns = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/design/`);
        const data = await response.json();
        setDesigns(data);
      } catch (error) {
        console.error("Failed to fetch designs:", error);
      }
    };

    fetchBriefs();
    fetchDesigns();
  }, []);

  const handleViewAll = () => {
    navigate("/briefs");
  };
  const handleViewAllDesign = () => {
    navigate("/designs");
  };

  return (
    <div>
      <Hero />
      <Search />
      <section className="relative flex items-center justify-between max-w-7xl z-20 mx-auto md:px-12">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">
            Try out the written briefs
          </h1>
          <hr className="py-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {briefs.slice(0, 3).map((brief) => (
              <BriefCard
                key={brief._id}
                briefId={brief._id}
                title={brief.title}
                description={brief.description}
              />
            ))}
          </div>
          {briefs.length > 3 && (
            <div className="flex justify-end mt-4">
              <button
                className="bg-[#0057FF] text-white py-2 px-4 rounded-full hover:bg-blue-600 transition"
                onClick={handleViewAll}
              >
                View All &rarr;
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Design Cards Section */}
      <section className="relative flex items-center justify-between max-w-7xl z-20 mx-auto md:px-12">
        <div className="p-4 ">
          <h1 className="text-2xl font-bold mb-4">Featured Designs</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {designs.slice(0, 6).map((design) => (
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
          {designs.length > 6 && (
            <div className="flex justify-end mt-4">
              <button
                className="bg-[#0057FF] text-white py-2 px-4 rounded-full hover:bg-blue-600 transition"
                onClick={handleViewAllDesign}
              >
                View All &rarr;
              </button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
