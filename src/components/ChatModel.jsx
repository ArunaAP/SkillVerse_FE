import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatModal = ({ clientId, designerId, designerName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);
  const chatId = `${clientId}-${designerId}`;

  // Fetch previous messages
  useEffect(() => {
    socket.emit("joinChatRoom", { clientId, designerId });

    socket.on("previousMessages", (oldMessages) => {
      setMessages(oldMessages);
    });

    return () => {
      socket.emit("leaveRoom", { clientId, designerId });
      socket.off("previousMessages");
    };
  }, [clientId, designerId]);

  // Listen for new messages
  useEffect(() => {
    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle send message
  const handleSendMessage = () => {
    const message = {
      text: newMessage,
      sender: clientId, // Adjust based on client role
      timestamp: new Date().toISOString(),
    };

    socket.emit("sendMessage", chatId, message);
    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage("");
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 flex justify-center items-center">
      <div className="fixed right-8 bottom-6 bg-white p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Chat with {designerName}</h3>
          <button onClick={onClose} className="text-gray-500">
            Close
          </button>
        </div>
        <div
          ref={chatContainerRef}
          className="h-72 overflow-y-auto mb-4  p-2"
        >
          {messages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-full mb-2 ${
                  msg.sender === clientId
                    ? "w-fit bg-blue text-white"
                    : "w-fit bg-gray-200"
                }`}
              >
                {msg.text}
              </div>
            ))
          )}
        </div>
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="border rounded-full p-2 flex-grow"
            placeholder="Type a message"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-blue text-white px-4 py-2 rounded-full"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
