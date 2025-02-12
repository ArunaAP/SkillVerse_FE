import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Briefs from "./components/Briefs";
import Designs from "./components/Designs";
import Portfolio from "./components/Portfolio";
import SingleDesignPage from "./components/SingleDesign";
import BriefPage from "./components/SingleBrief";
import AddBrief from "./components/AddBrief";
import "@fortawesome/fontawesome-free/css/all.min.css";
import UpdateBrief from "./components/UpdateBrief";
import AddDesignForm from "./components/AddDesign";
import ResultsPage from "./components/ResultsPage";
import SignUp from "./components/SignUp";
import ThreadsList from "./components/ThreadList";
import ThreadDetails from "./components/ThreadDetails";
import CreateThread from "./components/CreateThread";
import { jwtDecode } from "jwt-decode";

const App = () => {
  return (
    <Router>
      <Main />
    </Router>
  );
};

const Main = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Utility to check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    const { exp } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
  };

  // Monitor token and redirect on expiration
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Check if the current route is protected
    const protectedRoutes = [
      "/briefs",
      "/designs",
      "/portfolio/:designerId",
      "/design/:designId",
      "/brief/:briefId",
      "/add-brief",
      "/update-brief/:briefId",
      "/add-design/:briefId",
      "/results",
      "/community",
      "/threads/:id",
      "/create-thread",
    ];

    // If the user is on a protected route and the token is invalid, redirect to login
    const isProtectedRoute = protectedRoutes.some(
      (route) => location.pathname.startsWith(route.replace(/:\w+/g, "")) // Handle dynamic params
    );

    if ((!token || isTokenExpired(token)) && isProtectedRoute) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [location, navigate]);

  // Set dynamic title based on the current route
  useEffect(() => {
    let title = "SkillVerse"; // Default title

    switch (location.pathname) {
      case "/":
        title = "Home | SkillVerse";
        break;
      case "/login":
        title = "Login | SkillVerse";
        break;
      case "/briefs":
        title = "Briefs | SkillVerse";
        break;
      case "/designs":
        title = "Designs | SkillVerse";
        break;
      case "/portfolio/:designerId":
        title = "Portfolio | SkillVerse";
        break;
      case "/design/:designId":
        title = "Design Details | SkillVerse";
        break;
      case "/brief/:briefId":
        title = "Brief Details | SkillVerse";
        break;
      case "/add-brief":
        title = "Add Brief | SkillVerse";
        break;
      case "/update-brief/:briefId":
        title = "Update Brief | SkillVerse";
        break;
      case "/add-design/:briefId":
        title = "Add Design | SkillVerse";
        break;
      case "/results":
        title = "Results | SkillVerse";
        break;
      default:
        title = "SkillVerse";
    }

    document.title = title;
  }, [location]);

  return (
    <div className="relative w-full min-h-screen">
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <Navbar />
      )}

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
        <Route path="/community" element={<ThreadsList />} />
        <Route path="/threads/:id" element={<ThreadDetails />} />
        <Route path="/create-thread" element={<CreateThread />} />
      </Routes>
    </div>
  );
};

export default App;
