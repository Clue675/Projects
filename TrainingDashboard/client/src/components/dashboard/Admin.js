import React from 'react';
import DepartmentsManager from '../AdminComponents/DepartmentsManager';
import EmployeesManager from '../AdminComponents/EmployeesManager';
import "./Admin.css"; // Import the CSS file for styling

const Admin = () => {
  const [activeTab, setActiveTab] = React.useState('departments'); // 'departments' or 'employees'

  return (
    <div className="admin-container">
      <button onClick={() => setActiveTab('departments')}>Manage Departments</button>
      <button onClick={() => setActiveTab('employees')}>Manage Employees</button>

      {activeTab === 'departments' && <DepartmentsManager />}
      {activeTab === 'employees' && <EmployeesManager />}
    </div>
  );
};

export default Admin;
