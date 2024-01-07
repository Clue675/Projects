import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import axios from 'axios';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'vendorName', headerName: 'Vendor Name', width: 150, editable: true },
  { field: 'partNumber', headerName: 'Part Number', width: 130, editable: true },
  { field: 'quantity', headerName: 'Quantity', type: 'number', width: 90, editable: true },
  { field: 'partDescription', headerName: 'Part Description', width: 200, editable: true },
  { field: 'dateReceived', headerName: 'Date Received', type: 'date', width: 150, editable: true },
  // Add more columns as needed
];

export default function IncomingShipments() {
  const [rows, setRows] = useState([]);
  const [alert, setAlert] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/shipments'); // Replace with your actual API endpoint
        setRows(response.data.map((item, index) => ({ id: index + 1, ...item })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleRowEditCommit = async (params) => {
    try {
      const updatedRow = { ...rows.find((row) => row.id === params.id), [params.field]: params.value };
      await axios.put(`/api/shipments/${params.id}`, updatedRow); // Replace with your actual API endpoint
      setRows(rows.map((row) => (row.id === params.id ? updatedRow : row)));
      setAlert({ type: 'success', message: 'Row updated successfully' });
    } catch (error) {
      console.error('Error updating data:', error);
      setAlert({ type: 'error', message: 'Error updating row' });
    }
  };

  const handleAddRow = () => {
    const id = rows.length > 0 ? Math.max(...rows.map((row) => row.id)) + 1 : 1;
    const lastRowData = rows[rows.length - 1] || {};
    const newRow = { id, vendorName: '', partNumber: '', quantity: 0, ...lastRowData };
    setRows([...rows, newRow]);
    setAlert({ type: 'info', message: 'New row added' });
  };

  const handleDeleteRow = async (id) => {
    try {
      await axios.delete(`/api/shipments/${id}`); // Replace with your actual API endpoint
      setRows(rows.filter((row) => row.id !== id));
      setAlert({ type: 'warning', message: 'Row deleted' });
    } catch (error) {
      console.error('Error deleting data:', error);
      setAlert({ type: 'error', message: 'Error deleting row' });
    }
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      {alert && <Alert severity={alert.type}>{alert.message}</Alert>}
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        onRowEditCommit={handleRowEditCommit}
        components={{
          Toolbar: GridToolbar,
        }}
        experimentalFeatures={{ newEditingApi: true }}
      />
      <Button variant="contained" color="primary" onClick={handleAddRow} style={{ marginTop: '10px' }}>
        Add Row
      </Button>
      {rows.length > 0 && (
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDeleteRow(rows[rows.length - 1].id)}
          style={{ marginTop: '10px', marginLeft: '10px' }}
        >
          Delete Last Row
        </Button>
      )}
    </div>
  );
}
