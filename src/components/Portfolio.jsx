import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import DesignCard from './DesignCard';
import Footer from './Footer';

const socket = io("http://localhost:5000"); // Connect to the backend server

const ProfileSection = () => {
  const { designerId } = useParams();
  const [designer, setDesigner] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const userId = designerId;

  // Fetch designer data
  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${userId}`)
      .then((response) => response.json())
      .then((data) => setDesigner(data))
      .catch((error) => console.error("Error fetching designer data:", error));
  }, [userId]);

  // Fetch designs
  useEffect(() => {
    fetch("http://localhost:5000/api/design/")
      .then((response) => response.json())
      .then((data) => {
        const filteredDesigns = data.filter((design) => design.designer === userId);
        setDesigns(filteredDesigns);
      })
      .catch((error) => console.error("Error fetching designs:", error));
  }, [userId]);

  // Handle chat room join/leave
  useEffect(() => {
    if (showChatModal) {
      socket.emit("joinRoom", userId); // Join the chat room when modal is shown
    }

    return () => {
      if (showChatModal) {
        socket.emit("leaveRoom", userId); // Leave the chat room when modal is closed
      }
    };
  }, [showChatModal, userId]);

  // Listen for incoming messages
  useEffect(() => {
    socket.on("newMessage", (message) => {
      console.log("Received message:", message); // Log the received message
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, message];
        console.log("Updated messages:", updatedMessages); // Log the updated message list
        return updatedMessages;
      });
    });
  
    return () => {
      socket.off("newMessage");
    };
  }, []);
  

  // Handle sending messages
  const handleMessageClick = () => {
    setShowChatModal(true);
  };

  const handleSendMessage = () => {
    const message = {
      text: newMessage,
      sender: "client",
      timestamp: new Date().toISOString(),
    };
    console.log("Sending message:", message); // Log the message being sent
    socket.emit("sendMessage", userId, message); // Send message to the backend
    setNewMessage('');
  };

  if (!designer) {
    return <div>Loading designer information...</div>;
  }

  return (
    <div>
      <section className="relative flex items-center justify-between max-w-7xl z-20 mx-auto md:px-12 z-20">
        {/* Your existing portfolio layout */}
        <div className="bg-white py-8">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center z-20">
            <div className="mx-12">
              <img
                src={designer.profileImage || "https://via.placeholder.com/150"}
                alt={designer.fullname}
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-600"
              />
              <button
                className="mt-4 px-6 py-1 bg-blue text-white rounded-full shadow hover:bg-blue"
                onClick={handleMessageClick}
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
      <Footer />

      {/* Chat Modal */}
      {showChatModal && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 flex justify-center items-end">
    <div className="fixed bottom-8 right-8 w-96 bg-white p-4 rounded-lg shadow-lg z-50 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Chat with {designer.fullname}</h3>
        <button onClick={() => setShowChatModal(false)} className="text-gray-500">X</button>
      </div>
      <div className="h-72 overflow-y-auto mb-4">
        {messages.length != 0 ? (
          <p className="text-center">No messages yet.</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message p-2 rounded mb-2 ${msg.sender === 'client' ? 'text-right bg-blue text-white' : 'text-left bg-gray-100'}`}
            >
              <p>{msg.text}dfdg</p>
              
            </div>
          ))
        )}
      </div>

      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="border p-2 flex-grow"
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage} className="ml-2 bg-blue text-white px-4 py-2 rounded">Send</button>
      </div>
    </div>
  </div>
)}


    </div>
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
            designer={design.designer || "Unknown"}
            likes={design.likes || 0}
            createdAt={design.createdAt}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileSection;
