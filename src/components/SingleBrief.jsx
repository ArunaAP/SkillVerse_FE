import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "./Footer";

const BriefPage = ({ match }) => {

  const navigate = useNavigate();

const { briefId } = useParams(); 

  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrief = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/brief/${briefId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch the brief.");
        }
        const data = await response.json();
        setBrief(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrief();
  }, [briefId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleSubmitDesign = ()=>{
    navigate(`/add-design/${briefId}`)
  }

  return (
    <div>
    <section className="relative flex items-center justify-between max-w-7xl z-20 mx-auto md:px-12">
    <div className="container mx-auto py-8  min-h-screen">
      <div className="mb-6">
        <a href="/briefs" className="text-blue hover:underline text-sm">
          &lt; All Briefs
        </a>
          <h1 className="text-3xl font-bold mt-4 py-5">{brief.title}</h1>

          <hr className="py-5 " />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 pr-20">
          <h2 className="text-lg font-bold mb-2">Brief</h2>
          <p className="text-gray-800 leading-relaxed">{brief.description}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Deliverables</h2>
          {/* <ul className="list-disc ml-5">
            {brief.deliverables.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul> */}
          <p>Deadline: {brief.deadline}</p>

          <button
          className={`py-2 px-4 text-white bg-blue rounded-full focus:outline-none hover:bg-blue`}
          onClick={handleSubmitDesign}
        >
          Submit work
        </button>
        </div>
      </div>
      <div>
        <h2>Recent Work by Other Users</h2>
      </div>
    </div>
    </section>
    <Footer/>
    </div>
  );
};

export default BriefPage;
