import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [expiry, setExpiry] = useState(localStorage.getItem('expiry'));

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
      if (response.data.access_token) {
        const expiryDate = // Calculate the expiry based on the JWT token or server response
        setToken(response.data.access_token);
        setIsLoggedIn(true);
        localStorage.setItem('token', response.data.access_token);
        setExpiry(expiryDate);
        localStorage.setItem('expiry', expiryDate);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('expiry');
  };

  const renewToken = useCallback(async () => {
    try {
      const { data } = await axios.post('http://localhost:5000/token/refresh', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
    } catch (error) {
      console.log("Couldn't renew token:", error);
      logout(); // Logout the user if token renewal fails
    }
  }, [token]);  // Added token as a dependency for useCallback

  useEffect(() => {
    if (token) {
      const intervalId = setInterval(() => {
        if (new Date().getTime() > new Date(expiry).getTime() - 60000) { // 1 minute before expiry
          renewToken();
        }
      }, 60000); // Checks every 60 seconds

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [token, expiry, renewToken]);  // renewToken is now stable

  return (
    <AuthContext.Provider value={{ token, setToken, login, logout, isLoggedIn, setIsLoggedIn, renewToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
