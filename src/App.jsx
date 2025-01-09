import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import React Router components
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Briefs from './components/Briefs';
import Designs from './components/Designs';
import Portfolio from './components/Portfolio';
import SingleDesignPage from './components/SingleDesign';

import '@fortawesome/fontawesome-free/css/all.min.css';


const App = () => {
  return (
    
    <Router>
      <div className="relative w-full min-h-screen">
        {/* <div className="absolute top-80 left-20 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue rounded-full opacity-70 z-0 blur-[90px]"></div> */}
        <Navbar/>
        {/* Define routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/briefs" element={<Briefs />} />
          <Route path="/designs" element={<Designs />} />
          <Route path="/portfolio/:designerId" element={<Portfolio />} />
          <Route path="/design/:designId" element={<SingleDesignPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
