import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const ThreadDetails = () => {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/threads/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch thread details");
        }
        const data = await response.json();
        setThread(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/comments/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchThread();
    fetchComments();
  }, [id]);

  const handlePostComment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch(`${apiUrl}/api/comments/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }), // Only include text
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      const comment = await response.json();
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error.message);
    }
  };

  if (loading) return <p>Loading thread...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{thread.title}</h1>
      <p className="text-gray-700">{thread.description}</p>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment._id} className="bg-gray-100 p-4 rounded">
              {comment.text}
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border rounded p-2"
            rows="3"
            placeholder="Add a comment..."
          ></textarea>
          <button
            onClick={handlePostComment}
            className="bg-blue text-white px-4 py-2 rounded mt-2"
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreadDetails;
