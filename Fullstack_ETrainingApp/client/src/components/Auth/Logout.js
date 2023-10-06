import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user token and other data from local storage
    localStorage.removeItem('token');

    // Navigate the user back to the login page
    navigate('/login');
  }, [navigate]);

  return null;  // This component doesn't render anything
};

export default Logout;
