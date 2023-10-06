import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Importing Components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import SmartForm from "./components/Training/SmartForm";
import { AuthProvider, useAuth } from "./components/Auth/AuthContext";
import NavBar from "./components/Navbar/Navbar";
import HomePage from "./components/HomePage/HomePage";
import Logout from "./components/Auth/Logout";
import TrainingVerification from "./components/TrainingVerification/TrainingVerification";
import Dashboard from "./components/Dashboard/Dashboard";

// Removed ProtectedWrapper function

const App = () => {
  const authData = useAuth();
  console.log("Auth Data:", authData);

  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/smart-form" element={<SmartForm />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/training-verification" element={<TrainingVerification />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more Routes as needed */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
