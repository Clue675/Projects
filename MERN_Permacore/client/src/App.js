import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShipmentPage from './pages/Shipping';
import InspectionPage from './pages/Inspection';
import SupplierQualityPage from './pages/SupplierQuality';
import DashboardPage from './pages/Dashboard';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import SplashScreen from './pages/Home'; // Ensure this file exists

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SplashScreen />} /> {/* Default route is now SplashScreen */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/shipments" element={<ShipmentPage />} />
                <Route path="/inspection" element={<InspectionPage />} />
                <Route path="/supplier-quality" element={<SupplierQualityPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                {/* Add more routes for other pages as needed */}
            </Routes>
        </Router>
    );
};

export default App;
