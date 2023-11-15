import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { AuthContext } from '../Auth/AuthContext';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');  // State for the search term
  const [trainingData, setTrainingData] = useState([]);  // State for the training data
  const { token } = useContext(AuthContext);  // Token from the AuthContext

  // Function to handle search term changes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Fetch training data when the search term changes
  useEffect(() => {
    if (searchTerm) {
      const config = {
        headers: { Authorization: `Bearer ${token}` }  // Authorization header
      };
      axios.get(`http://localhost:5000/search?query=${searchTerm}`, config)
        .then(response => {
          setTrainingData(response.data.data);  // Update training data state
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
        });
    }
  }, [searchTerm, token]);

  // Columns for the DataGrid
  const columns = [
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'badgeNumber', headerName: 'Badge Number', width: 150 },
    { field: 'workCenter', headerName: 'Work Center', width: 150 },
    { field: 'trainingTitle', headerName: 'Training Title', width: 150 },
    { field: 'trainer', headerName: 'Trainer', width: 150 },
    { field: 'date', headerName: 'Date', width: 150 }
  ];

  return (
    <div>
      {/* Search input */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {/* DataGrid to display training data */}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={trainingData} columns={columns} />
      </div>
    </div>
  );
}


