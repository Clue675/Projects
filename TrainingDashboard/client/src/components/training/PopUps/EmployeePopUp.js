import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, CircularProgress, Alert } from '@mui/material';

const EmployeeDetailsDialog = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/employees/');
        const formattedEmployees = response.data.map(emp => ({ ...emp, id: emp._id })); // Ensure each employee has an `id` for the grid
        setEmployees(formattedEmployees);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
        setError('Failed to fetch employees. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleRowDoubleClick = (params) => {
    setSelectedEmployee(params.row);
  };

  const handleCloseDialog = () => {
    setSelectedEmployee(null);
  };

  const columns = [
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'badgeNumber', headerName: 'Badge Number', width: 120 },
    { field: 'departmentName', headerName: 'Department', width: 200 },
    { field: 'divisionName', headerName: 'Division', width: 200 },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <DataGrid
          rows={employees}
          columns={columns}
          pageSize={5}
          onRowDoubleClick={handleRowDoubleClick}
          components={{ Toolbar: GridToolbar }}
          autoHeight
        />
      )}
      {selectedEmployee && (
        <EmployeeDetailsDialog
          employee={selectedEmployee}
          onClose={handleCloseDialog}
        />
      )}
    </Box>
  );
};

export default EmployeeDetailsDialog;
