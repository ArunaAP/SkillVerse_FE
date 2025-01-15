import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import DesignCard from './DesignCard'; // Import the DesignCard component
import BriefCard from './BriefCard'; // Import the BriefCard component
import Search from './Search';

const ResultsPage = () => {
    const location = useLocation();
    const { designResults, briefResults } = location.state || {};

    const [filteredDesigns, setFilteredDesigns] = useState(designResults);
    const [filteredBriefs, setFilteredBriefs] = useState(briefResults);
    const [filter, setFilter] = useState({
        title: "",
        designer: "",
        date: "",
    });

    // Function to handle changes in filters
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });

        // Filter designs based on the filter criteria
        const filteredDesignsList = designResults.filter((design) => {
            const matchesTitle = design.title.toLowerCase().includes(filter.title.toLowerCase());
            const matchesDesigner = design.designer.title.toLowerCase().includes(filter.designer.toLowerCase());
            const matchesDate = design.createdAt.includes(filter.date);
            return matchesTitle && matchesDesigner && matchesDate;
        });
        setFilteredDesigns(filteredDesignsList);

        // Filter briefs by title
        const filteredBriefsList = briefResults.filter((brief) =>
            brief.title.toLowerCase().includes(filter.title.toLowerCase())
        );
        setFilteredBriefs(filteredBriefsList);
    };

    return (
        <div>
                <Search />
                <section className="relative flex items-center justify-between max-w-7xl z-20 mx-auto md:px-12">
                <div className="flex space-x-6 max-w-7xl mx-auto ">
                    {/* Left sidebar for filters */}
                    <div className="w-1/4 bg-gray-100 p-4  rounded-lg">
                        <h3 className="font-semibold text-lg">Filters</h3>


                        {/* Filter by Title */}
                        <input
                            type="text"
                            placeholder="Search by Title"
                            name="title"
                            value={filter.title}
                            onChange={handleFilterChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                        />

                        {/* Filter by Designer */}
                        <input
                            type="text"
                            placeholder="Search by Designer"
                            name="designer"
                            value={filter.designer}
                            onChange={handleFilterChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                        />

                        {/* Filter by Date */}
                        <input
                            type="text"
                            placeholder="Search by Date (YYYY-MM-DD)"
                            name="date"
                            value={filter.date}
                            onChange={handleFilterChange}
                            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Right side displaying the results */}
                    <div className="w-3/4 space-y-8">
                        {/* Design Results */}
                        <div>
                            <h2 className="text-xl font-semibold mb-5">Designs</h2>
                            {filteredDesigns.length === 0 ? (
                                <p>No designs found.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredDesigns.map((design) => (
                                        <DesignCard
                                            key={design._id}
                                            designId={design._id}
                                            image={design.image}
                                            title={design.title}
                                            designer={design.designer._id} // Pass designer ID
                                            likes={design.likes}
                                            createdAt={design.createdAt}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Brief Results */}
                        <div>
                            <h2 className="text-xl font-semibold">Briefs</h2>
                            {filteredBriefs.length === 0 ? (
                                <p>No briefs found.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredBriefs.map((brief) => (
                                        <BriefCard
                                            key={brief._id}
                                            briefId={brief._id}
                                            title={brief.title}
                                            description={brief.description}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
        </section>
            </div>
    );
};

export default ResultsPage;
