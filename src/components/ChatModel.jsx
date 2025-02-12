import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL;
const socket = io.connect(`${apiUrl}`, { withCredentials: true });

const ChatModal = ({ clientId, designerId, designerName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState([]);

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

  const chatId = `${clientId}-${designerId}`;

  useEffect(() => {
    // Fetch user's chat rooms
    const fetchChats = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/chats/${id}`);
        if (!response.ok) throw new Error("Failed to fetch chats");
        const data = await response.json();
        setChats(data);

        // Access each chat ID
        data.chats.forEach((chat) => {
          console.log("Chat ID:", chat._id); // Access the _id (chatId)
          console.log("Last Message:", chat.lastMessage.text);
        });
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [id]);

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
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle send message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return; // Prevent sending empty messages

    const message = {
      text: newMessage,
      sender: role, // Adjust based on client role
      timestamp: new Date().toISOString(),
    };

    // Emit the message to the server
    socket.emit("sendMessage", chatId, message);

    // Clear the input field
    setNewMessage("");
  };

  console.log("Selected chat", selectedChat._id);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 flex justify-center items-center">
      <div className="w-1/3 bg-gray-100 p-4 h-screen overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Chats</h2>
        {chats.length === 0 ? (
          <p>No chats available</p>
        ) : (
          chats.map((chat) => {
            const participants = chat._id.split("-");
            const otherUser = participants.find((id) => id !== id);

            return (
              <div
                key={chat._id}
                className="p-3 bg-white rounded-lg shadow-md mb-2 cursor-pointer"
                onClick={() => setSelectedChat(chat)}
              >
                <p className="font-medium">Chat with {otherUser}</p>
                <p className="text-gray-500 text-sm">
                  {chat.lastMessage?.text || "No messages yet"}
                </p>
              </div>
            );
          })
        )}
      </div>

      <div className="fixed right-8 bottom-6 bg-white p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Chat with {designerName}</h3>
          <button onClick={onClose} className="text-gray-500 px-1">
            <i class="fa-solid fa-circle-xmark"></i>
          </button>
        </div>
        <div ref={chatContainerRef} className="h-72 overflow-y-auto mb-4 p-2">
          {messages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="mb-4">
                {/* Chat bubble */}
                <div
                  className={`p-2 rounded-full ${
                    msg.sender === role
                      ? "flex w-fit bg-blue text-white justify-end ml-auto"
                      : "w-fit bg-gray-200"
                  }`}
                >
                  {msg.text}
                </div>

                {/* Timestamp below the bubble */}
                <div
                  className={`text-xs text-gray-500 mt-1 ${
                    msg.sender === role ? "text-right" : "text-left"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
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
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-blue text-white px-4 py-2 rounded-full"
          >
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
