import React, { useState, useEffect, useContext } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const { token, renewToken } = useContext(AuthContext);
  const location = useLocation(); // To keep track of the current URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsError(null);
        const response = await axios.get('http://localhost:5000/api/getUserDetails', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          timeout: 5000 // 5 seconds timeout
        });
        // You can add additional checks here based on the response
      } catch (error) {
        setIsError(error.message || 'An unknown error occurred');
        if (error.response && error.response.status === 401) {
          renewToken();
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [token]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {isError}</p>; // Enhanced error message
  }

  return (
    <Route {...rest} render={(props) => (
      token
        ? <Component {...props} />
        : <Redirect to={{
            pathname: '/login',
            state: { from: location } // To redirect the user back to this page
          }} />
    )} />
  );
};

export default ProtectedRoute;

