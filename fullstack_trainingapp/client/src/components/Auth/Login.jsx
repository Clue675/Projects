import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import { AuthContext } from '../Auth/AuthContext';  // Import AuthContext

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const { setToken, setIsLoggedIn } = useContext(AuthContext);  // Destructure setToken and setIsLoggedIn from context
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      navigate('/');
    }
  }, [setToken, setIsLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const res = await axios.post('http://localhost:5000/login', credentials);
      
      if (res.data.access_token) {
        localStorage.setItem('token', res.data.access_token);
        setToken(res.data.access_token);
        setIsLoggedIn(true);  // Update the context
        navigate('../Dashboard/Dashboard.jsx');  // Navigate to homepage
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred while logging in.');
    }
  };

  return (
    <div className="wrapper">
      <div className="logo">
        <img src="https://th.bing.com/th/id/OIP.K-4RqDC6zFrpAG31ayDDOgHaHa?pid=ImgDet&rs=1" alt="" />
      </div>
      <div className="text-center mt-4 name">
        Training Database Login
      </div>
      <form className="p-3 mt-3" onSubmit={handleSubmit}>
        <div className="form-field d-flex align-items-center">
          <span className="far fa-user"></span>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
        </div>
        <div className="form-field d-flex align-items-center">
          <span className="fas fa-key"></span>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </div>
        <button className="btn mt-3" type="submit">Login</button>
      </form>
      <div className="text-center fs-6 action-container">
        <div className="action-text">Forget password? or</div>
        <div className="action-buttons">
          <button onClick={() => navigate('/register')} className="action-button">Register Here</button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Login;
