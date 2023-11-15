import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Importing Components
import Register from "./components/Register/Register";
import SmartForm from "./components/Training/SmartForm";
import { AuthProvider, useAuth } from "./components/Auth/AuthContext";
import NavBar from "./components/Navbar/Navbar";
import HomePage from "./components/HomePage/HomePage";
import Logout from "./components/Logout/Logout";
import TrainingVerification from "./components/TrainingVerification/TrainingVerification";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import CertificateGenerator from "./components/CertificateGenerator/CertificateGenerator";

const AuthCheck = () => {
  const authData = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = authData && authData.isAuthenticated;
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [authData, navigate]);

  return null;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate an API call to check authentication
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // You can replace this with your actual API call
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or component
  }

  return (
    <Router>
      <AuthProvider>
        <ToastContainer />
        <NavBar />
        <Routes>
          <Route path="/*" element={<AuthCheck />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/smart-form" element={<SmartForm />} />
          <Route path="/search" element={<HomePage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/training-verification" element={<TrainingVerification />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/CertificateGenerator" element={<CertificateGenerator />} />
          {/* Add more Routes as needed */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
