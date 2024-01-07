import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';

const ShipmentPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    fetchShipments();
    fetchVendors();
  }, []);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/shipments');
      setShipments(response.data);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    }
    setLoading(false);
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get('/api/vendors');
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor);
    setVendorDialogOpen(false);
  };

  const handleSaveRow = async (params) => {
    const data = { ...params, vendorName: selectedVendor?.vendorName || params.vendorName };
    try {
      if (params.isNew) {
        await axios.post('/api/shipments', data);
      } else {
        await axios.put(`/api/shipments/${params.id}`, data);
      }
      fetchShipments();
    } catch (error) {
      console.error('Error saving shipment:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'vendorName',
        headerName: 'Vendor Name',
        width: 150,
        editable: true,
        renderCell: (params) => (
            <>
                <TextField
                    value={selectedVendor?.vendorName || params.row.vendorName}
                    onChange={(e) => {/* Handle TextField change here */}}
                    disabled
                />
                <IconButton onClick={vendorDialogOpen}>
                    <SearchIcon />
                </IconButton>
            </>
        ),
    },
    { field: 'purchaseOrderNumber', headerName: 'PO Number', width: 180, editable: true },
    { field: 'workOrder', headerName: 'Work Order', width: 180, editable: true },
    { field: 'reworkOrder', headerName: 'Rework Order', width: 180, editable: true },
    { field: 'expectedDeliveryDate', headerName: 'Expected Delivery', width: 180, editable: true, type: 'date' },
    { field: 'dateReceived', headerName: 'Date Received', width: 180, editable: true, type: 'date' },
    { field: 'partNumber', headerName: 'Part Number', width: 130, editable: true },
    { field: 'quantityShipped', headerName: 'Quantity Shipped', width: 130, editable: true, type: 'number' },
    { field: 'unitCost', headerName: 'Unit Cost', width: 130, editable: true, type: 'number' },
    { field: 'notes', headerName: 'Notes', width: 200, editable: true },
    // Add more columns as needed
];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4">Shipment Management</Typography>
      <Button onClick={() => setVendorDialogOpen(true)}>Select Vendor</Button>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={shipments}
          columns={columns}
          pageSize={10}
          loading={loading}
          processRowUpdate={handleSaveRow}
          components={{ Toolbar: GridToolbar }}
        />
      </div>

      {/* Vendor Selection Dialog */}
      <Dialog open={vendorDialogOpen} onClose={() => setVendorDialogOpen(false)}>
        <DialogTitle>Select a Vendor</DialogTitle>
        <DialogContent>
          <List>
            {vendors.map((vendor) => (
              <ListItem button key={vendor._id} onClick={() => handleVendorSelect(vendor)}>
                <ListItemText primary={vendor.vendorName} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ShipmentPage;


    

   