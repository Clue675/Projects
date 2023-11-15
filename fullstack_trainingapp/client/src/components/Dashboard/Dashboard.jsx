
import React from 'react';
import EmployeeChart from './EmployeeChart/EmployeeChart';
import TrainingChart from '../TrainingChart/TrainingChart';
import './Dashboard.css';  // Import CSS for styling

const Dashboard = () => {
  return (
    <div className="dashboard-container">  {/* Apply CSS class for styling */}
      <h1>Dashboard</h1>
      <div className="chart-container">
        <EmployeeChart />
      </div>
      <div className="chart-container">
        <TrainingChart />
      </div>
      <div className="chart-container">  {/* Apply CSS class for responsiveness */}

      </div>
    </div>
  );
};

export default Dashboard;




