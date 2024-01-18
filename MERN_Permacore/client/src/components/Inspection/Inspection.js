import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Grid, Select, MenuItem
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const InspectionPage = () => {
  const [inspections, setInspections] = useState([]);
  const [rejectionCodes, setRejectionCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [discrepancyDialogOpen, setDiscrepancyDialogOpen] = useState(false);
  const [discrepancyReport, setDiscrepancyReport] = useState({});
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchInspections();
    fetchRejectionCodes();
  }, []);

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/inspections/');
      setInspections(response.data);
    } catch (error) {
      console.error('Error fetching inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRejectionCodes = async () => {
    try {
      const response = await axios.get('/api/rejectionCodes');
      setRejectionCodes(response.data);
    } catch (error) {
      console.error('Error fetching rejection codes:', error);
    }
  };

  const handleDiscrepancyReportChange = (e) => {
    setDiscrepancyReport({ ...discrepancyReport, [e.target.name]: e.target.value });
  };

  const submitDiscrepancyReport = async () => {
    try {
      await axios.post('/api/discrepancyReports', discrepancyReport);
      alert('Discrepancy report submitted successfully.');
    } catch (error) {
      console.error('Error submitting discrepancy report:', error);
    }
    setDiscrepancyDialogOpen(false);
  };

  const handleRejectionCodeChange = async (inspectionId, newValue) => {
    try {
      await axios.put(`/api/inspections/${inspectionId}`, { rejectionCode: newValue });
      fetchInspections();
    } catch (error) {
      console.error('Error updating inspection:', error);
    }
  };

  const handleEditInspection = (inspection) => {
    setSelectedInspection(inspection);
    setEditDialogOpen(true);
  };

  const handleUpdateInspection = async () => {
    if (!selectedInspection || !selectedInspection._id) {
      alert('No inspection selected for update.');
      return;
    }
  
    try {
      // Make an API call to update the inspection data
      await axios.put(`/api/inspections/${selectedInspection._id}`, selectedInspection);
      alert('Inspection updated successfully.');
  
      // Refresh the inspections list to show the updated data
      fetchInspections();
    } catch (error) {
      console.error('Error updating inspection:', error);
      alert('Failed to update inspection.');
    }
  
    // Close the edit dialog
    setEditDialogOpen(false);
  };  

  const columns = [
    { field: 'inspectorName', headerName: 'Inspector Name', width: 150 },
    { field: 'inspectionDate', headerName: 'Inspection Date', width: 130, type: 'date' },
    { field: 'quantityReceived', headerName: 'Quantity Received', width: 130, type: 'number' },
    { field: 'quantityAccepted', headerName: 'Quantity Accepted', width: 130, type: 'number' },
    { field: 'quantityRejected', headerName: 'Quantity Rejected', width: 130, type: 'number' },
    {
      field: 'rejectionCode',
      headerName: 'Rejection Code',
      width: 130,
      renderCell: (params) => (
        <Select
          value={params.value || ''}
          onChange={(e) => handleRejectionCodeChange(params.id, e.target.value)}
          style={{ width: '100%' }}
        >
          {rejectionCodes.map((code) => (
            <MenuItem key={code._id} value={code._id}>{code.description}</MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditInspection(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => setDiscrepancyDialogOpen(true)}>
            <ReportProblemIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inspection Management
      </Typography>

      <div style={{ height: 400, width: '100%', marginTop: 20 }}>
        <DataGrid
          rows={inspections}
          columns={columns}
          pageSize={10}
          loading={loading}
          components={{ Toolbar: GridToolbar }}
        />
      </div>

      {/* Edit Inspection Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Inspection</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="inspectorName"
            label="Inspector Name"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedInspection?.inspectorName || ''}
            onChange={(e) => setSelectedInspection({ ...selectedInspection, inspectorName: e.target.value })}
          />
          {/* Add more fields as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateInspection} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Discrepancy Report Dialog */}
      <Dialog open={discrepancyDialogOpen} onClose={() => setDiscrepancyDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create Discrepancy Report</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                name="discrepancyDetails"
                label="Discrepancy Details"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleDiscrepancyReportChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="notes"
                label="Notes"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleDiscrepancyReportChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDiscrepancyDialogOpen(false)}>Cancel</Button>
          <Button onClick={submitDiscrepancyReport} variant="contained">Submit Report</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InspectionPage;
