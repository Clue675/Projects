import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Typography, CircularProgress } from '@mui/material';

const InspectionBacklogComponent = () => {
    const [pendingInspections, setPendingInspections] = useState([]);
    const [editStatusDialogOpen, setEditStatusDialogOpen] = useState(false);
    const [selectedInspection, setSelectedInspection] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchPendingInspections = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/inspections/pending');
            setPendingInspections(response.data.map(inspection => ({
                ...inspection,
                id: inspection._id,
            })));
        } catch (error) {
            console.error('Error fetching pending inspections:', error);
            setError('Error fetching pending inspections');
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchPendingInspections();
    }, []);

    const updateInspectionStatus = async () => {
        if (!selectedInspection || !newStatus) {
            setError('No inspection selected or new status provided.');
            return;
        }
        try {
            await axios.put(`/api/inspections/${selectedInspection.id}`, { status: newStatus });
            fetchPendingInspections();
            setEditStatusDialogOpen(false);
            setSelectedInspection(null);
            setNewStatus('');
        } catch (error) {
            console.error('Error updating inspection status:', error);
            setError('Error updating inspection status');
        }
    };

    const columns = [
        { field: 'inspectionId', headerName: 'Inspection ID', width: 120 },
        { field: 'vendorName', headerName: 'Vendor Name', width: 150 },
        { field: 'purchaseOrderNumber', headerName: 'PO Number', width: 120 },
        { field: 'workOrderNumber', headerName: 'Work Order Number', width: 130, type: 'number' },
        { field: 'reworkNumber', headerName: 'Rework Number', width: 130, type: 'number' },
        { field: 'inspectionDate', headerName: 'Inspection Date', width: 150, type: 'date' },
        { field: 'inspectorName', headerName: 'Inspector Name', width: 150 },
        { field: 'quantityReceived', headerName: 'Quantity Received', width: 150, type: 'number' },
        { field: 'quantityAccepted', headerName: 'Quantity Accepted', width: 150, type: 'number' },
        { field: 'quantityRejected', headerName: 'Quantity Rejected', width: 150, type: 'number' },
        { field: 'atFault', headerName: 'At Fault', width: 130 },
        { field: 'notes', headerName: 'Notes', width: 200 },
        { field: 'status', headerName: 'Status', width: 130 },
        {
            field: 'edit',
            headerName: 'Edit',
            sortable: false,
            width: 100,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                const onClick = () => {
                    setSelectedInspection(params.row);
                    setNewStatus(params.row.status);
                    setEditStatusDialogOpen(true);
                };

                return <Button onClick={onClick} variant="contained" color="primary">Edit</Button>;
            },
        },
    ];

    return (
        <Box sx={{ height: '100vh', width: '100%', padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Inspection Backlog
            </Typography>
            {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {error && (
                        <Typography color="error" gutterBottom>
                            {error}
                        </Typography>
                    )}
                    <DataGrid
                        rows={pendingInspections}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        checkboxSelection
                    />
                </>
            )}
            <Dialog open={editStatusDialogOpen} onClose={() => setEditStatusDialogOpen(false)}>
                <DialogTitle>Edit Inspection Status</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="status"
                        label="New Status"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditStatusDialogOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={updateInspectionStatus} variant="contained" color="primary">Update Status</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InspectionBacklogComponent;
