import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
      if (response.data.access_token) {
        setToken(response.data.access_token);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const renewToken = async () => {
    try {
      const { data } = await axios.post('http://localhost:5000/token/refresh', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setToken(data.access_token);
    } catch (error) {
      console.log("Couldn't renew token", error);
    }
  };

  useEffect(() => {
    if (token) {
      // You can set this to renew at different intervals or under different conditions
      const intervalId = setInterval(() => {
        renewToken();
      }, 60000); // Renews every 60 seconds

      // Cleanup interval on component unmount
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, login, isLoggedIn, setIsLoggedIn, renewToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
