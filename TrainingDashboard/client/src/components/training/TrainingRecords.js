import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

const TrainingRecords = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchAllTrainingRecords();
  }, []);

  const fetchAllTrainingRecords = async () => {
    try {
      const response = await axios.get('/api/trainings'); // Make sure the endpoint matches your server setup
      const transformedRecords = response.data.map(record => ({
        ...record,
        id: record._id, // Ensure there's a unique 'id' field
        date: record.date ? new Date(record.date).toLocaleDateString() : '', // Format date if necessary
        // Ensure department and any nested fields are correctly accessed based on the actual response structure
      }));
      setRecords(transformedRecords);
    } catch (error) {
      console.error('Error fetching training records:', error);
    }
  };
  

  const columns = [
    // Ensure these fields match your transformed data structure
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'badgeNumber', headerName: 'Badge Number', width: 130 },
    { field: 'trainerName', headerName: 'Trainer Name', width: 150 },
    { field: 'date', headerName: 'Date', width: 110 },
    { field: 'workCenter', headerName: 'Work Center', width: 130 },
    { field: 'department', headerName: 'Department', width: 150 },
    // Add or adjust columns as needed
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <h2>Training Records</h2>
      <DataGrid
        rows={records}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
      />
    </div>
  );
};

export default TrainingRecords;
