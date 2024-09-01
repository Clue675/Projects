import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserManagement from './components/AdminComponents/UserManagement';
import RequiredTraining from './components/training/RequiredTraining';
import DepartmentPieChart from './components/training/Charts/DepartmentPieChart';
import TrainingCompletionChart from './components/training/Charts/TrainingCompletionChart';
import TrainingDetails from './components/training/TrainingDetails';
import TrainingForm from './components/training/TrainingForm';
import Admin from './components/dashboard/Admin';
import BottomNav from './components/dashboard/BottomNav';
import Employees from './components/Employees/Employee';
import MainPage from './pages/MainPage';

function App() {
  const currentPath = window.location.pathname;
  const isDashboardRoute = currentPath === '/dashboard';
  const isLoginPage = currentPath === '/login';
  const isSignupPage = currentPath === '/signup';

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/required-training" element={<RequiredTraining />} />
        <Route path="/department-pie-chart" element={<DepartmentPieChart />} />
        <Route path="/training-completion-chart" element={<TrainingCompletionChart />} />
        <Route path="/mainPage" element={<MainPage />} />
        <Route path="/training-details" element={<TrainingDetails />} />
        <Route path="/training-form" element={<TrainingForm />} />
        <Route path="/admin-setting" element={<Admin />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>

      {!isDashboardRoute && !isLoginPage && !isSignupPage && <BottomNav />}
    </Router>
  );
}

export default App;
