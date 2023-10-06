import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import SmartForm from './components/SmartForm/SmartForm';
import TrainingVerification from './components/TrainingVerification/TrainingVerification';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { AuthProvider } from './components/AuthContext'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/smart-form" element={<ProtectedRoute component={SmartForm} />} />
            <Route path="/training-verification" element={<ProtectedRoute component={TrainingVerification} />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
