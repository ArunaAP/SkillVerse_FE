import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import React Router components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Login from './components/Login';

const App = () => {
  return (
    
    <Router>
      <div className="relative w-full min-h-screen">
        {/* <div className="absolute top-80 left-20 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue rounded-full opacity-70 z-0 blur-[90px]"></div> */}

        {/* Define routes */}
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
