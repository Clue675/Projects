import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Grid, CircularProgress } from '@mui/material';

const IncomingShipments = () => {
  const [newShipment, setNewShipment] = useState({
    order_id: '',
    line_item: '',
    vendor_name: '',
    workorder_number: '',
    rework_number: '',
    part_number: '',
    qty_received: '',
    unit_cost: '',
    date_received: '',
    comments: ''
  });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/shipments/incoming')
      .then(response => setRows(response.data))
      .catch(error => {
        console.error('Error fetching data:', error);
        alert('Error fetching data. Check console for details.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setNewShipment({ ...newShipment, [e.target.name]: e.target.value });
  };

  const formatDate = (dateString) => {
    const [month, day, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedShipment = {
      ...newShipment,
      line_item: newShipment.line_item.toString(), // Ensuring line_item is a string
      date_received: formatDate(newShipment.date_received),
    };

    axios.post('http://localhost:5000/api/incoming', formattedShipment)
      .then(response => {
        setRows([...rows, response.data]);
        setNewShipment({
          order_id: '',
          line_item: '',
          vendor_name: '',
          workorder_number: '',
          rework_number: '',
          part_number: '',
          qty_received: '',
          unit_cost: '',
          date_received: '',
          comments: ''
        });
      })
      .catch(error => {
        console.error('Error submitting new shipment:', error);
        if (error.response) {
          console.error('Error Response Data:', error.response.data);
          console.error('Error Status:', error.response.status);
          console.error('Error Headers:', error.response.headers);
        } else if (error.request) {
          console.error('Error Request:', error.request);
        } else {
          console.error('Error Message:', error.message);
        }
        console.error('Error Config:', error.config);
        alert('Error submitting new shipment. Check console for details.');
      })
      .finally(() => setLoading(false));
  };

  const columns = [
    { field: 'order_id', headerName: 'PO Number', width: 130 },
    { field: 'line_item', headerName: 'Line Item', width: 130 },
    { field: 'vendor_name', headerName: 'Vendor Name', width: 200 },
    { field: 'workorder_number', headerName: 'Work Order Number', width: 180 },
    { field: 'rework_number', headerName: 'Rework Number', width: 180 },
    { field: 'part_number', headerName: 'Part Number', width: 180 },
    { field: 'qty_received', headerName: 'Quantity Received', width: 180 },
    { field: 'unit_cost', headerName: 'Unit Cost', width: 130 },
    { field: 'date_received', headerName: 'Date Received', width: 180 },
    { field: 'comments', headerName: 'Comments', width: 250 },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <form onSubmit={handleSubmit}>
          {/* Form fields for adding a new shipment */}
          <TextField label="Order ID" name="order_id" value={newShipment.order_id} onChange={handleChange} fullWidth />
          <TextField label="Line Item" name="line_item" value={newShipment.line_item} onChange={handleChange} fullWidth />
          <TextField label="Vendor Name" name="vendor_name" value={newShipment.vendor_name} onChange={handleChange} fullWidth />
          <TextField label="Work Order Number" name="workorder_number" value={newShipment.workorder_number} onChange={handleChange} fullWidth />
          <TextField label="Rework Number" name="rework_number" value={newShipment.rework_number} onChange={handleChange} fullWidth />
          <TextField label="Part Number" name="part_number" value={newShipment.part_number} onChange={handleChange} fullWidth />
          <TextField label="Quantity Received" name="qty_received" value={newShipment.qty_received} onChange={handleChange} fullWidth />
          <TextField label="Unit Cost" name="unit_cost" value={newShipment.unit_cost} onChange={handleChange} fullWidth />
          <TextField label="Date Received" name="date_received" value={newShipment.date_received} onChange={handleChange} fullWidth />
          <TextField label="Comments" name="comments" value={newShipment.comments} onChange={handleChange} fullWidth multiline rows={4} />
          <Button type="submit" variant="contained" color="primary">Add Shipment</Button>
        </form>
      </Grid>
      <Grid item xs={12} md={6}>
        <div style={{ height: 600, width: '100%' }}>
          {loading ? <CircularProgress /> : (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
            />
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default IncomingShipments;
