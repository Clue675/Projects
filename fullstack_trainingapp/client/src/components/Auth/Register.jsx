import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css'; 

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    work_center: '',
    // Remove access_level from the state and the form
  });

  const workCenters = [
    'Maintenance',
    'Diplomacy',
    'Operations',
    'Training',
    'Politics',
    // ... add all other work centers here
  ];

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError(null);
      setSuccess(null);
      // Remove access_level from the payload
      const { access_level, ...payload } = credentials;
      const res = await axios.post('http://localhost:5000/register', payload);

      if (res.data.message === 'User registered successfully') {
        setSuccess('User registered successfully.');
        alert('User registered successfully!'); // Displaying the pop-up
        // Optionally, navigate to login or update app state
      } else {
        setError('Failed to register user.');
      }
    } catch (err) {
      console.error('There was an error registering:', err);
      setError('An error occurred while registering.');
    }
  };

  return (
    <div className="wrapper">
      <div className="logo">
        <img src="https://th.bing.com/th/id/OIP.K-4RqDC6zFrpAG31ayDDOgHaHa?pid=ImgDet&rs=1" alt="" />
      </div>
      <div className="text-center mt-4 name">
        Training Database Register
      </div>
      <form className="p-3 mt-3" onSubmit={handleSubmit}>
        <div className="form-field d-flex align-items-center">
          <span className="far fa-user"></span>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={credentials.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-field d-flex align-items-center">
          <span className="fas fa-key"></span>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <div className="form-field d-flex align-items-center">
          <span className="fas fa-user"></span>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={credentials.first_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-field d-flex align-items-center">
          <span className="fas fa-user"></span>
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={credentials.last_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-field d-flex align-items-center">
          <span className="fas fa-building"></span>
          <select name="work_center" value={credentials.work_center} onChange={handleChange}>
            {workCenters.map((center, index) => (
              <option key={index} value={center}>
                {center}
              </option>
            ))}
          </select>
        </div>
        {/* Removed the access_level field */}
        <button className="btn mt-3" type="submit">
          Register
        </button>
      </form>
      <div className="action-container">
        <div className="action-text">Already have an account?</div>
        <div className="action-buttons">
          <button className="action-button" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};

export default Register;
