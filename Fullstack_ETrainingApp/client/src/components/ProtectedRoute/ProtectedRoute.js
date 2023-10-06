import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const { token, renewToken } = useContext(AuthContext);
  const location = useLocation();

  const fetchData = useCallback(async () => {
    try {
      setIsError(null);
      const response = await axios.get('http://localhost:5000/api/getUserDetails', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 5000
      });
      // Add additional checks based on the response here
    } catch (error) {
      setIsError(error.message || 'An unknown error occurred');
      if (error.response && error.response.status === 401) {
        renewToken();
      }
    }
    setIsLoading(false);
  }, [token, renewToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {isError}</p>;
  }

  return (
    <Route {...rest} element={
      token ? <Element /> : <Navigate to="/login" state={{ from: location }} />
    } />
  );
};

export default ProtectedRoute;
