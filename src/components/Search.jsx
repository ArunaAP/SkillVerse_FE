import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation

export default function SearchComponent() {
  const [query, setQuery] = useState("");
  const [designResults, setDesignResults] = useState([]);
  const [briefResults, setBriefResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Using React Router to navigate to results page

  

  const handleSearch = async () => {
    if (!query) return; // Do nothing if the query is empty

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/search?query=${query}`);

      // Log the raw response to see what is returned
      const rawResponse = await response.text();
      console.log("Raw response:", rawResponse);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = JSON.parse(rawResponse); // Explicitly parse the response
      console.log("Parsed data:", data);

      setDesignResults(data.designs);
      setBriefResults(data.briefs);

      // Navigate to the results page after a successful search
      navigate("/results", {
        state: { designResults: data.designs, briefResults: data.briefs },
      });
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex items-center justify-between max-w-7xl z-20 mx-auto md:px-12">
      <div className="relative w-full py-4">
        <div className="flex items-center space-x-4 py-4 rounded-full w-full">
          <button className="bg-gray-50 text-gray-600 px-4 py-2 rounded-full shadow">
            <i className="fa-solid fa-sliders"></i> Filter
          </button>

          <div className="flex items-center flex-grow bg-gray-50 px-4 py-2 rounded-full shadow">
            <i className="fa-solid fa-magnifying-glass text-gray-600 mr-2"></i>
            <input
              type="text"
              className="flex-grow focus:outline-none bg-gray-50 text-gray-800 w-full"
              placeholder="Search Designs or Briefs"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <button
            onClick={handleSearch}
            className="bg-blue text-white px-4 py-2 rounded-full shadow hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {loading && <p>Loading...</p>}
      </div>
    </section>
  );
}
