import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const CorrectiveActionPage = () => {
    const [correctiveActions, setCorrectiveActions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState({ status: 'Issued' });

    useEffect(() => {
        fetchCorrectiveActions();
    }, []);

    const fetchCorrectiveActions = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/correctiveActions');
            setCorrectiveActions(response.data);
        } catch (error) {
            console.error('Error fetching corrective actions:', error);
        }
        setLoading(false);
    };

    const handleDialogOpen = (action = { status: 'Issued' }) => {
        setCurrentAction(action);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setCurrentAction({ status: 'Issued' });
    };

    const handleInputChange = (e) => {
        setCurrentAction({ ...currentAction, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (currentAction._id) {
            await axios.put(`/api/correctiveActions/${currentAction._id}`, currentAction);
        } else {
            await axios.post('/api/correctiveActions', currentAction);
        }
        handleDialogClose();
        fetchCorrectiveActions();
    };

    const columns = [
        { field: 'correctiveActionId', headerName: 'Action ID', width: 130 },
        { field: 'vendorName', headerName: 'Vendor Name', width: 180 },
        { field: 'discrepancyReportId', headerName: 'Discrepancy Report ID', width: 180 },
        { field: 'actionDetails', headerName: 'Action Details', width: 200 },
        { field: 'status', headerName: 'Status', width: 150 },
        { field: 'notes', headerName: 'Notes', width: 200 },
        { field: 'createdAt', headerName: 'Created At', width: 180, valueGetter: (params) => params.row.createdAt ? new Date(params.row.createdAt).toLocaleString() : '' },
        { field: 'updatedAt', headerName: 'Updated At', width: 180, valueGetter: (params) => params.row.updatedAt ? new Date(params.row.updatedAt).toLocaleString() : '' }
        // Add other columns as needed
    ];

    return (
        <Container maxWidth="lg">
            <Typography variant="h4">Corrective Action Management</Typography>
            <Button onClick={() => handleDialogOpen()}>Add New Corrective Action</Button>
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={correctiveActions}
                    columns={columns}
                    pageSize={10}
                    loading={loading}
                />
            </div>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{currentAction._id ? 'Edit Corrective Action' : 'Add Corrective Action'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Action Details"
                        name="actionDetails"
                        value={currentAction.actionDetails || ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Notes"
                        name="notes"
                        value={currentAction.notes || ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Select
                        label="Status"
                        name="status"
                        value={currentAction.status}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="Issued">Issued</MenuItem>
                        <MenuItem value="Containment">Containment</MenuItem>
                        <MenuItem value="Response Received">Response Received</MenuItem>
                        {/* Add other status options */}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit}>Save</Button>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default CorrectiveActionPage;
