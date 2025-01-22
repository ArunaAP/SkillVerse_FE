import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import CustomAlert from "./CustomAlert"; // Import the CustomAlert component

const ThreadsList = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({
    isOpen: false,
    threadId: null,
    message: "",
  });
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userData = token
    ? (() => {
        try {
          const tokenPayload = JSON.parse(atob(token.split(".")[1]));
          return {
            fullname: tokenPayload?.fullname || null,
            profileImage: tokenPayload?.profileImage || null,
            role: tokenPayload?.role || null,
          };
        } catch (error) {
          console.error("Error parsing token:", error);
          return { fullname: null, profileImage: null, role: null };
        }
      })()
    : { fullname: null, profileImage: null, role: null };

  const { fullname, role } = userData;

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/threads");
        if (!response.ok) {
          throw new Error("Failed to fetch threads");
        }
        const data = await response.json();
        setThreads(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  const handleDeleteThread = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/threads/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the thread.");
      }

      // Remove the deleted thread from the state
      setThreads((prevThreads) =>
        prevThreads.filter((thread) => thread._id !== id)
      );

      // Close alert and notify success
      setAlert({ isOpen: false, threadId: null, message: "" });
      alert("Thread deleted successfully.");
    } catch (error) {
      console.error("Error deleting thread:", error);
      setAlert({ isOpen: false, threadId: null, message: "" });
      alert("Error deleting the thread. Please try again.");
    }
  };

  const confirmDelete = (id) => {
    setAlert({
      isOpen: true,
      threadId: id,
      message: "Are you sure you want to delete this thread?",
    });
  };

  if (loading) return <p>Loading threads...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="relative flex items-center justify-between max-w-7xl z-20 mx-auto md:px-12">
      <div className="container mx-auto py-8">
        {/* Greeting Section */}
        <div className="flex items-center justify-between py-4 rounded-lg mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">
              Welcome to SkillVerse community, {fullname || "Guest"}!
            </h1>
            <p className="text-gray-600">
              Find answers to your questions and help others answer theirs.
            </p>
          </div>
          <button
            onClick={() => navigate("/create-thread")}
            className="bg-blue text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            Ask Question
          </button>
        </div>

        {/* Threads List */}
        <ul className="space-y-4">
          {threads.map((thread) => (
            <li
              key={thread._id}
              className="bg-white p-4 rounded-lg border-b border-gray-200 hover:shadow-md cursor-pointer"
              onClick={() => navigate(`/threads/${thread._id}`)}
            >
              <h2 className="text-md text-blue mb-2">{thread.title}</h2>
              <p className="text-xs text-gray-600 mb-2">{thread.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {thread.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-gray-500 text-xs">
                  <p className="text-blue">
                    {thread.author?.fullname || "Unknown Author"}
                  </p>
                  asked{" "}
                  {formatDistanceToNow(new Date(thread.createdAt), {
                    addSuffix: true,
                  }).replace("about", "")}
                </div>
              </div>
              <div className="flex justify-end">
                {role === "Admin" && (
                  <div className="flex flex-wrap gap-2 px-5">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        confirmDelete(thread._id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <CustomAlert
        isOpen={alert.isOpen}
        title="Delete Thread"
        message={alert.message}
        onConfirm={() => handleDeleteThread(alert.threadId)}
        onCancel={() =>
          setAlert({ isOpen: false, threadId: null, message: "" })
        }
      />
    </section>
  );
};

export default ThreadsList;
