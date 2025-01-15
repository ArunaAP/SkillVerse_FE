import React, { useEffect } from 'react';
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
import ResultsPage from './components/ResultsPage';
import SignUp from './components/SignUp';

const App = () => {
  return (
    <Router>
      <Main />
    </Router>
  );
};

const Main = () => {
  const location = useLocation();

  // Set dynamic title based on the current route
  useEffect(() => {
    let title = 'SkillVerse'; // Default title

    switch (location.pathname) {
      case '/':
        title = 'Home | SkillVerse';
        break;
      case '/login':
        title = 'Login | SkillVerse';
        break;
      case '/briefs':
        title = 'Briefs | SkillVerse';
        break;
      case '/designs':
        title = 'Designs | SkillVerse';
        break;
      case '/portfolio/:designerId':
        title = 'Portfolio | SkillVerse';
        break;
      case '/design/:designId':
        title = 'Design Details | SkillVerse';
        break;
      case '/brief/:briefId':
        title = 'Brief Details | SkillVerse';
        break;
      case '/add-brief':
        title = 'Add Brief | SkillVerse';
        break;
      case '/update-brief/:briefId':
        title = 'Update Brief | SkillVerse';
        break;
      case '/add-design/:briefId':
        title = 'Add Design | SkillVerse';
        break;
      case '/results':
        title = 'Results | SkillVerse';
        break;
      default:
        title = 'SkillVerse';
    }

    document.title = title;
  }, [location]);

  return (
    <div className="relative w-full min-h-screen">
      {location.pathname !== '/login' && location.pathname !== '/signup' && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/briefs" element={<Briefs />} />
        <Route path="/designs" element={<Designs />} />
        <Route path="/portfolio/:designerId" element={<Portfolio />} />
        <Route path="/design/:designId" element={<SingleDesignPage />} />
        <Route path="/brief/:briefId" element={<BriefPage />} />
        <Route path="/add-brief" element={<AddBrief />} />
        <Route path="/update-brief/:briefId" element={<UpdateBrief />} />
        <Route path="/add-design/:briefId" element={<AddDesignForm />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </div>
  );
};

export default App;
