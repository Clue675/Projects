import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SupplierQuality from './pages/SupplierQuality/SupplierQuality';
import IncomingShipments from './pages/IncomingShipments/IncomingShipments';
import ReceivingInspection from './pages/ReceivingInspection/ReceivingInspection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/supplier-quality" element={<SupplierQuality />} />
        <Route path="/incoming-shipments" element={<IncomingShipments />} />
        <Route path="/receiving-inspection" element={<ReceivingInspection />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;

