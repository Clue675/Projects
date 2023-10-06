import React from 'react';
import { Link } from 'react-router-dom';
import './SidePanel.css';

const SidePanel = () => {
  return (
    <div className="side-panel">
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/smartform">Smart Form</Link>
      <Link to="/verify">Training Verification</Link>
      <Link to="/logout">Logout</Link>
    </div>
  );
};

export default SidePanel;
