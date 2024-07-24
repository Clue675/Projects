// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShipmentPage from "./pages/Shipping";
import InspectionPage from "./pages/Inspection";
import SupplierQualityPage from "./pages/SupplierQuality";
import DashboardPage from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import SplashScreen from "./pages/Home"; 
import { WebSocketProvider } from './utils/WebSocketProvider';
import KanbanPage from "./pages/KanbanPage";
import ApprovedSupplierPage from "./pages/ApprovedSupplierPage";
import SupplierDashboard from "./pages/SupplierDashboard"; // Import the SupplierDashboard

const App = () => {
  return (
    <WebSocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/shipments" element={<ShipmentPage />} />
          <Route path="/inspection" element={<InspectionPage />} />
          <Route path="/supplier-quality" element={<SupplierQualityPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/approved-supplier" element={<ApprovedSupplierPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/supplier-dashboard" element={<SupplierDashboard />} /> {/* Use the SupplierDashboard */}
        </Routes>
      </Router>
    </WebSocketProvider>
  );
};

export default App;

