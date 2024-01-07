import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShipmentPage from './pages/Shipping'; // Import the ShipmentPage component
import LoginPage from './pages/Login'; // Import the LoginPage component
import RegisterPage from './pages/Register'; // Import the RegisterPage component
// Import other components if necessary

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/login" element={<LoginPage />} /> 
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/shipments" element={<ShipmentPage />} /> 
                    {/* Add more routes for other pages as needed */}
                    {/* Redirect to login or another page as the default route */}
                    <Route path="*" element={<LoginPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
