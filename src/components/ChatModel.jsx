import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL;
const socket = io.connect(`${apiUrl}`, { withCredentials: true });

const ChatModal = ({ designerId, onClose }) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const chatContainerRef = useRef(null);

  // Parse the token to get user details
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

  useEffect(() => {
    if (!id) return;

    // Fetch user's chat rooms
    const fetchChats = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/chats/${id}`);
        if (!response.ok) throw new Error("Failed to fetch chats");
        const data = await response.json();
        setChats(data.chats || []);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [id]);

  useEffect(() => {
    if (!selectedChat) return;

    const { _id: chatId } = selectedChat;

    // Join the chat room
    socket.emit("joinChatRoom", { chatId });

    socket.on("previousMessages", (oldMessages) => {
      setMessages(oldMessages);
    });

    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.emit("leaveRoom", { chatId });
      socket.off("previousMessages");
      socket.off("newMessage");
    };
  }, [selectedChat]);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message = {
      chatId: selectedChat._id,
      text: newMessage,
      sender: id, // Ensure 'sender' is passed correctly
      senderRole: role,
      timestamp: new Date().toISOString(),
    };

    console.log("Sending message:", message);
    socket.emit("sendMessage", message, (ack) => {
      console.log("Message sent acknowledgment:", ack);
    });

    setNewMessage("");
  };

  const handleNewChat = async () => {
    console.log("designer id", designerId);
    console.log(" id", id);

    if (!designerId) return;

    try {
      // Check if a chat already exists
      const response = await fetch(
        `${apiUrl}/api/chats/check/${id}/${designerId}`
      );
      if (!response.ok) throw new Error("Failed to check existing chat");

      const { chatExists, existingChat } = await response.json();

      if (chatExists) {
        // If chat exists, open it
        setSelectedChat(existingChat);
      } else {
        // If chat does not exist, create a new chat
        // Join the chat room
        const chatId = `${id}-${designerId}`;
        socket.emit("joinChatRoom", { chatId });

        if (!createResponse.ok) throw new Error("Failed to create chat");

        const newChat = await createResponse.json();

        setChats((prevChats) => [newChat, ...prevChats]); // Add new chat to state
        setSelectedChat(newChat); // Open the new chat
      }
    } catch (error) {
      console.error("Error handling new chat:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 flex justify-center items-center">
      <div className="w-3/4 h-screen flex bg-gray-100 rounded-lg shadow-lg overflow-hidden">
        {/* Chats List (Left Side) */}
        <div className="w-1/3 bg-gray-200 p-4 overflow-y-auto">
          <button onClick={onClose} className="text-gray-500 px-1">
            <i className="fa-solid fa-circle-xmark"></i>
          </button>

          {/* <button
            onClick={() => handleNewChat()}
            className="bg-blue text-white px-3 py-1 rounded text-sm"
          >
            New Chat
          </button> */}

          <h2 className="text-lg font-bold mb-4">Chats</h2>
          {chats.length === 0 ? (
            <p>No chats available</p>
          ) : (
            chats.map((chat) => {
              const participants = chat._id.split("-");
              const otherUser = participants.find(
                (participant) => participant !== id
              );

              return (
                <div
                  key={chat._id}
                  className={`p-3 bg-white rounded-lg shadow-md mb-2 cursor-pointer ${
                    selectedChat?._id === chat._id ? "bg-blue-200" : ""
                  }`}
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

        {/* Chat Box (Right Side) */}
        <div className="flex-1 bg-white p-4 flex flex-col">
          {selectedChat ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">
                  Chat with {selectedChat._id.replace(id, "").replace("-", "")}
                </h3>
              </div>
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto mb-4 p-2"
              >
                {messages.length === 0 ? (
                  <p>No messages yet.</p>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-4 flex ${
                        msg.sender === id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className="flex flex-col">
                        <div
                          className={`p-2 rounded-full max-w-xs ${
                            msg.sender === id
                              ? "bg-blue text-white"
                              : "bg-gray-200 text-black"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <div
                          className={`text-xs text-gray-500 mt-1 ${
                            msg.sender === id ? "text-right" : "text-left"
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="flex mt-auto">
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
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </>
          ) : (
            <p>Select a chat to start messaging.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
