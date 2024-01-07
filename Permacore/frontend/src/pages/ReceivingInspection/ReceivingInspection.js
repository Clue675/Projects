import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import axios from 'axios';

const columns = [
  // ... your existing columns ...
  // Make sure to match these column fields with your Inspection model's properties
];

export default function ReceivingInspection() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios.get('/inspections')
      .then(response => setRows(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleRowEditCommit = async (params) => {
    // ... your existing code for handleRowEditCommit ...
  };

  const handleAddRow = () => {
    // ... your existing code for handleAddRow ...
  };

  const handleDeleteRow = async (id) => {
    // ... your existing code for handleDeleteRow ...
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        onRowEditCommit={handleRowEditCommit}
        components={{ Toolbar: GridToolbar }}
        experimentalFeatures={{ newEditingApi: true }}
      />
      <Button variant="contained" color="primary" onClick={handleAddRow} style={{ marginTop: '10px' }}>
        Add Row
      </Button>
      {rows.length > 0 && (
        <Button variant="contained" color="error" onClick={() => handleDeleteRow(rows[rows.length - 1].id)} style={{ marginTop: '10px', marginLeft: '10px' }}>
          Delete Last Row
        </Button>
      )}
    </div>
  );
}
