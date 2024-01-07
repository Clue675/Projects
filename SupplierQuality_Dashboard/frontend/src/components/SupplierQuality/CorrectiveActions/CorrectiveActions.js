import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, FormControl, InputLabel, Select, MenuItem, TextField, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Grid
} from '@mui/material';
import NonconformingNotificationComponent from './NonconformingNotification';

const CorrectiveActionsForm = () => {
  const [discrepancyReports, setDiscrepancyReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedAction, setSelectedAction] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/discrepancy/reports')
      .then(response => {
        setDiscrepancyReports(response.data);
      })
      .catch(error => console.error('Error fetching discrepancy reports:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleReportSelect = (report) => {
    setSelectedReport(report);
    setSelectedAction(''); // Reset action selection
  };

  const handleActionChange = (event) => {
    setSelectedAction(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedReport || !selectedAction) {
      alert('Please select a discrepancy report and an action to continue.');
      return;
    }

    // Logic for submitting selected action (depends on your backend API)
    // Example:
    try {
      const response = await axios.post('http://localhost:5000/api/submit-action', {
        reportId: selectedReport.id,
        action: selectedAction
        // Additional data as needed
      });
      alert(`Action submitted successfully: ${response.data.message}`);
    } catch (error) {
      console.error('Error submitting action:', error);
      alert('Failed to submit action. Please try again.');
    }
  };

  return (
    <Paper sx={{ p: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom>Discrepancy Reports</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="Discrepancy Reports">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Part Name</TableCell>
              <TableCell>Issue Details</TableCell>
              <TableCell>Select</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {discrepancyReports.map((report) => (
              <TableRow key={report.id} hover selected={selectedReport?.id === report.id} onClick={() => handleReportSelect(report)}>
                <TableCell>{report.id}</TableCell>
                <TableCell>{report.part_name}</TableCell>
                <TableCell>{report.issue_details}</TableCell>
                <TableCell>
                  <Button variant="outlined">Select</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedReport && (
        <Box sx={{ my: 2 }}>
          <Typography variant="h6" gutterBottom>Selected Report: {selectedReport.id}</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="action-select-label">Action</InputLabel>
                <Select
                  labelId="action-select-label"
                  id="action-select"
                  value={selectedAction}
                  label="Action"
                  onChange={handleActionChange}
                >
                  <MenuItem value={'Nonconforming Notification'}>Nonconforming Notification</MenuItem>
                  <MenuItem value={'Supplier Corrective Action'}>Supplier Corrective Action</MenuItem>
                  <MenuItem value={'Internal Notification'}>Internal Notification</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleSubmit}>Submit Action</Button>
            </Grid>
          </Grid>

          {selectedAction === 'Nonconforming Notification' && <NonconformingNotificationComponent />}
        </Box>
      )}

      {loading && <CircularProgress />}
    </Paper>
  );
};

export default CorrectiveActionsForm;
