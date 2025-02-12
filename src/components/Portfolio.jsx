import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DesignCard from "./DesignCard";
import Footer from "./Footer";
import ChatModal from "./ChatModel";
const apiUrl = import.meta.env.VITE_API_URL;

const ProfileSection = () => {
  const { designerId } = useParams();
  const [designer, setDesigner] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  // Parse the token and extract the fullname and role
  const token = localStorage.getItem("token");
  const userData = token
    ? (() => {
        try {
          const tokenPayload = JSON.parse(atob(token.split(".")[1]));
          return {
            id: tokenPayload?.id || null,
            role: tokenPayload?.role || null,
          };
        } catch (error) {
          console.error("Error parsing token:", error);
          return { id: null, role: null };
        }
      })()
    : { id: null, role: null };

  const { id, role } = userData;

  // Fetch designer data
  useEffect(() => {
    fetch(`${apiUrl}/api/users/${designerId}`)
      .then((response) => response.json())
      .then((data) => setDesigner(data))
      .catch((error) => console.error("Error fetching designer data:", error));
  }, [designerId]);

  // Fetch designs
  useEffect(() => {
    fetch(`${apiUrl}/api/design/`)
      .then((response) => response.json())
      .then((data) => {
        const filteredDesigns = data.filter(
          (design) => design.designer === designerId
        );
        setDesigns(filteredDesigns);
      })
      .catch((error) => console.error("Error fetching designs:", error));
  }, [designerId]);

  if (!designer) {
    return <div>Loading designer information...</div>;
  }

  // Handle share button click
  const handleShare = () => {
    const shareURL = `${window.location.origin}/portfolio/${designerId}`;
    navigator.clipboard
      .writeText(shareURL)
      .then(() => {
        setCopySuccess("URL copied to clipboard!");
        setTimeout(() => setCopySuccess(""), 2000); // Clear success message after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
        setCopySuccess("Failed to copy URL.");
      });
  };

  const totalLikes = designs.reduce(
    (sum, design) => sum + (design.likes || 0),
    0
  );

  return (
    <div>
      <section className="relative flex items-center justify-between max-w-7xl z-20 mx-auto md:px-12">
        <div className="bg-white py-8">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
            <div className="mx-12">
              <img
                src={designer.profileImage || "https://via.placeholder.com/150"}
                alt={designer.fullname}
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-600"
              />
              <button
                className="mt-4 px-6 py-1 bg-blue text-white rounded-full shadow hover:bg-blue"
                onClick={() => setShowChatModal(true)}
              >
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
                  <i className="fa-solid fa-globe pr-2"></i>
                  <p className="text-gray-600">{designer.region}</p>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-envelope pr-2"></i>
                  <p className="text-gray-600">{designer.email}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-6 mt-6 md:mt-0 md:ml-auto">
              <div className="text-center">
                <p className="text-gray-600">Likes</p>
                <p className="text-1xl font-bold">{totalLikes}</p>
              </div>

              <div className="text-center">
                <p className="text-gray-600">Designs</p>
                <p className="text-1xl font-bold">{designs.length}</p>
              </div>
              <div className="text-center">
                <button
                  className="text-blue-600 hover:text-blue-700 flex flex-col items-center"
                  onClick={handleShare}
                >
                  <span>Share</span> <i className="fas fa-share mb-1 p-1"></i>
                  {/* Add margin-bottom for spacing */}
                </button>
                {copySuccess && (
                  <p className="text-xs text-green-500 mt-1">{copySuccess}</p>
                )}
              </div>
            </div>
          </div>
          <DesignsGrid designs={designs} />
        </div>
      </section>
      <Footer />
      {showChatModal && (
        <ChatModal
          clientId={id}
          designerId={designerId}
          designerName={designer.fullname}
          onClose={() => setShowChatModal(false)}
        />
      )}
    </div>
  );
};

const DesignsGrid = ({ designs }) => {
  if (designs.length === 0) {
    return (
      <p className="text-center mt-6">
        No designs available for this designer.
      </p>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <hr className="mt-8" />
      <h3 className="text-2xl font-bold mb-6 mt-5">Designs</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {designs.map((design) => (
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
    </div>
  );
};

export default ProfileSection;
