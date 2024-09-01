import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import RejectionCodeForm from './ControlForms/RejectionCodeForm';
import RejectionCodeTable from './PanelTables/RejectionCodeTable';

const RejectionCodeControlPanel = () => {
    const [rejectionCodes, setRejectionCodes] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCode, setSelectedCode] = useState(null);
    const [existingCategories, setExistingCategories] = useState([]);

    const fetchRejectionCodes = async () => {
        try {
            const response = await axios.get('/api/rejectionCodes');
            setRejectionCodes(response.data);
            setExistingCategories([...new Set(response.data.map(code => code.category))]);
        } catch (error) {
            setSnackbarMessage("Failed to fetch rejection codes.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    useEffect(() => {
        fetchRejectionCodes();
    }, []);

    const handleCreateUpdateCode = async (code) => {
        try {
            if (selectedCode) {
                await axios.put(`/api/rejectionCodes/${selectedCode._id}`, code);
                setSnackbarMessage("Rejection code updated successfully.");
            } else {
                await axios.post('/api/rejectionCodes', code);
                setSnackbarMessage("Rejection code created successfully.");
            }
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            fetchRejectionCodes();
            setOpenDialog(false);
        } catch (error) {
            setSnackbarMessage("Failed to create/update rejection code.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const handleDeleteCode = async (codeId) => {
        try {
            await axios.delete(`/api/rejectionCodes/${codeId}`);
            setSnackbarMessage("Rejection code deleted successfully.");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            fetchRejectionCodes();
        } catch (error) {
            setSnackbarMessage("Failed to delete rejection code.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedCode(null);
    };

    const handleAddNew = () => {
        setSelectedCode(null);
        setOpenDialog(true);
    };

    const handleEdit = (code) => {
        setSelectedCode(code);
        setOpenDialog(true);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Rejection Code Control Panel</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleAddNew}>Add New Rejection Code</Button>
                </Grid>
                <Grid item xs={12}>
                    <RejectionCodeTable codes={rejectionCodes} onEdit={handleEdit} onDelete={handleDeleteCode} />
                </Grid>
            </Grid>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Dialog open={openDialog} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{selectedCode ? 'Edit Rejection Code' : 'Add New Rejection Code'}</DialogTitle>
                <DialogContent>
                    <RejectionCodeForm onSubmit={handleCreateUpdateCode} initialData={selectedCode} existingCategories={existingCategories} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default RejectionCodeControlPanel;
