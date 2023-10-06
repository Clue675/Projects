import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import SmartForm from "./components/SmartForm";
import DragAndDrop from "./components/DragAndDrop";
import FileUpload from "./components/FileUpload";
import SearchBar from "./components/SearchBar";
import './App.css';
import jwtDecode from 'jwt-decode';

const jwt_decode = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (e) {
    console.error("Failed to decode token", e);
    return null;
  }
};

const AuthenticatedApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const login = () => {
    setIsAuthenticated(true);
    navigate('/');
  };

  const logout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decoded = jwt_decode(token);
      if (decoded && decoded.exp > Date.now() / 1000) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);
  console.log("Hello World from app.js")
  return (
    <div>
      <Routes>
        <Route path="/login" element={ isAuthenticated ? null : <Login login={login} /> } />
        <Route path="/register" element={ isAuthenticated ? null : <Register /> } />
        <Route path="/" element={ isAuthenticated ? <><SmartForm /><DragAndDrop /><FileUpload /><SearchBar /><button onClick={logout}>Logout</button></> : null } />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthenticatedApp />
    </BrowserRouter>
  );
};

export default App;



