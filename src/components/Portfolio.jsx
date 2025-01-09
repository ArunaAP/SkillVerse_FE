import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import DesignCard from "./DesignCard"; // Import the DesignCard component


const ProfileSection = () => {
    const { designerId } = useParams(); 
  const [designer, setDesigner] = useState(null);
  const [designs, setDesigns] = useState([]);
//   const userId = "677f8bfa0f277be17a745775";
  const userId = designerId;

  // Fetch designer data
  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${userId}`)
      .then((response) => response.json())
      .then((data) => setDesigner(data))
      .catch((error) => console.error("Error fetching designer data:", error));
  }, [userId]);

  // Fetch all designs and filter by designer ID
  useEffect(() => {
    fetch("http://localhost:5000/api/design/")
      .then((response) => response.json())
      .then((data) => {
        const filteredDesigns = data.filter((design) => design.designer === userId);
        setDesigns(filteredDesigns);
      })
      .catch((error) => console.error("Error fetching designs:", error));
  }, [userId]);

  if (!designer) {
    return <div>Loading designer information...</div>;
  }

  return (
    <section className="relative flex items-center justify-between max-w-7xl z-20 mx-auto md:px-12 z-20">
      <div className="absolute top-60 -right-[480px] transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue rounded-full opacity-70 z-0 blur-[90px]"></div>
      <div className="bg-white py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center z-20">
          <div className="mx-12">
            <img
              src={designer.profileImage || "https://via.placeholder.com/150"}
              alt={designer.fullname}
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-600"
            />
            <button className="mt-4 px-6 py-1 bg-blue text-white rounded-full shadow hover:bg-blue">
              Message
            </button>
          </div>
          <div className="mt-4 md:mt-0 md:ml-6">
            <h2 className="text-3xl font-bold">{designer.fullname}</h2>
            <div className="pl-5 pt-3 gap-3">
                <div className="flex items-center">
                    <i className="fa-solid fa-briefcase pr-2"></i>
                    <p className="text-gray-600">{designer.role}</p>
                </div>
                <div className="flex items-center">
                    <i class="fa-solid fa-globe pr-2"></i>
                    <p className="text-gray-600">{designer.region}</p>
                </div>
                <div className="flex items-center">
                    <i class="fa-solid fa-envelope pr-2"></i>
                    <p className="text-gray-600">{designer.email}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-6 mt-6 md:mt-0 md:ml-auto">
            <div className="text-center">
              <p className="text-gray-600">Likes</p>
              <p className="text-1xl font-bold">{designer.likes || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Designs</p>
              <p className="text-1xl font-bold">{designs.length}</p>
            </div>
            <div className="text-center">
              <i className="fas fa-share"></i> Share
              <button className="text-blue-600 hover:text-blue-700"></button>
            </div>
          </div>
        </div>
        <DesignsGrid designs={designs} />
      </div>
    </section>
  );
};

const DesignsGrid = ({ designs }) => {
  if (designs.length === 0) {
    return <p className="text-center mt-6">No designs available for this designer.</p>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <hr className="mt-8" />
      <h3 className="text-2xl font-bold mb-6 mt-5">Designs</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {designs.map((design) => (
          <DesignCard
            key={design.id}
            image={design.image || "https://via.placeholder.com/300"}
            title={design.title}
            designer={design.creatorName || "Unknown"}
            likes={design.likes || 0}
            createdAt={design.createdAt}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileSection;
