// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import SupplierQualityDashboard from './pages/SupplierQualityDashboard';
import VendorDashboard from './pages/VendorDashboard'; // Import the Vendor Dashboard component
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ErrorBoundary>
            <SupplierQualityDashboard />
          </ErrorBoundary>
        } />
        <Route path="/vendor-dashboard" element={
          <ErrorBoundary>
            <VendorDashboard /> {/* Vendor Dashboard route */}
          </ErrorBoundary>
        } />
      </Routes>
    </div>
  );
}

export default App;
