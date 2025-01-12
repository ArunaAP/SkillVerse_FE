import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; 
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Briefs from './components/Briefs';
import Designs from './components/Designs';
import Portfolio from './components/Portfolio';
import SingleDesignPage from './components/SingleDesign';
import BriefPage from './components/SingleBrief';
import AddBrief from './components/AddBrief';
import '@fortawesome/fontawesome-free/css/all.min.css';
import UpdateBrief from './components/UpdateBrief';
import AddDesignForm from './components/AddDesign';

const App = () => {
  return (
    <Router>
      <Main />
    </Router>
  );
};

const Main = () => {
  const location = useLocation(); 

  return (
    <div className="relative w-full min-h-screen">
      {location.pathname !== '/login' && location.pathname !== '/signup' && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/briefs" element={<Briefs />} />
        <Route path="/designs" element={<Designs />} />
        <Route path="/portfolio/:designerId" element={<Portfolio />} />
        <Route path="/design/:designId" element={<SingleDesignPage />} />
        <Route path="/brief/:briefId" element={<BriefPage />} />
        <Route path="/add-brief" element={<AddBrief />} />
        <Route path="/update-brief/:briefId" element={<UpdateBrief />} />
        <Route path="/add-design/:briefId" element={<AddDesignForm />} />
      </Routes>
    </div>
  );
};

export default App;
