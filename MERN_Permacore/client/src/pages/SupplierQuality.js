import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';


const SupplierQualityPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState({});

    useEffect(() => {
        fetchSupplierData();
    }, []);

    const fetchSupplierData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/supplierQuality');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching supplier data:', error);
        }
        setLoading(false);
    };

    const handleDialogOpen = (supplier = {}) => {
        setCurrentSupplier(supplier);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setCurrentSupplier({});
    };

    const handleSubmit = async () => {
        // Logic to save or update supplier data
        handleDialogClose();
        fetchSupplierData();
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'supplierName', headerName: 'Supplier Name', width: 180 },
        { field: 'qualityScore', headerName: 'Quality Score', width: 130, type: 'number' },
        // Add more columns as needed
    ];

    return (
        <Container maxWidth="lg">
            <Typography variant="h4">Supplier Quality Management</Typography>
            <Button onClick={() => handleDialogOpen()}>Add New Supplier</Button>
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={data}
                    columns={columns}
                    pageSize={10}
                    loading={loading}
                    components={{ Toolbar: GridToolbar }}
                />
            </div>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{currentSupplier.id ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Supplier Name"
                        name="supplierName"
                        value={currentSupplier.supplierName || ''}
                        onChange={(e) => setCurrentSupplier({ ...currentSupplier, supplierName: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Quality Score"
                        name="qualityScore"
                        value={currentSupplier.qualityScore || ''}
                        onChange={(e) => setCurrentSupplier({ ...currentSupplier, qualityScore: e.target.value })}
                        fullWidth
                        type="number"
                    />
                    {/* Add more input fields as needed */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SupplierQualityPage;
