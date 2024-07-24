import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Snackbar,
  Alert,
  DialogActions,
  TextField,
  Autocomplete,
  Switch,
  FormControlLabel,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import SupplierScorecardDialog from "../SupplierQuality/SupplierScorecardDialog";
import SupplierDetailDialog from "../SupplierQuality/SupplierDetailDialog"; // New component for detailed view

const SupplierPerformanceScorecard = ({ open, onClose }) => {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [details, setDetails] = useState(null); // State to hold detailed view data
  const [startDate, setStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().substring(0, 10));
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDetailedView, setIsDetailedView] = useState(false); // Toggle for detailed view

  const fetchSuggestions = async (input) => {
    if (input.length > 2) {
      try {
        const response = await axios.get(`/api/vendors/`, { params: { query: input } });
        setSuggestions(response.data.map(vendor => ({ label: vendor.vendorName, id: vendor._id })));
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setError('Error fetching vendor suggestions');
      }
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/vendorPerformance/${searchInput.id}/byDate`, {
        params: { startDate, endDate },
      });
      if (response.data && response.data.length) {
        setPerformance(response.data[0]);
        setError('');
      } else {
        setError('No performance data found. Try adjusting your search terms.');
        setPerformance(null);
      }

      // Fetch detailed data if detailed view is selected
      if (isDetailedView) {
        const detailResponse = await axios.get(`/api/vendorPerformance/${searchInput.id}/details`, {
          params: { startDate, endDate },
        });
        if (detailResponse.data) {
          setDetails(detailResponse.data);
        }
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setError('Failed to fetch performance data. Please check your network and try again.');
      setPerformance(null);
    }
  };

  const handlePrint = () => {
    setDialogOpen(true);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
        Supplier Performance Scorecard
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              options={suggestions}
              onChange={(event, newValue) => setSearchInput(newValue)}
              onInputChange={(event, newInputValue) => {
                fetchSuggestions(newInputValue);
              }}
              renderInput={(params) => <TextField {...params} label="Vendor Number or Name" fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={isDetailedView}
                  onChange={() => setIsDetailedView(!isDetailedView)}
                  color="primary"
                />
              }
              label="Detailed View"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSearch} sx={{ marginRight: 2 }}>
              Search
            </Button>
            <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>
              Print
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {performance && (
        <Paper sx={{ p: 2, mt: 2, position: "relative" }}>
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            {performance.vendorName} - {performance.vendorNumber}
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            Rating Period: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>Delivery Rating: {performance.deliveryRating}%</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Quality Rating: {performance.qualityRating}%</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>Overall Rating: {performance.overallRating}%</Typography>
            </Grid>
          </Grid>
          <Typography variant="caption" sx={{ position: "absolute", bottom: 5, right: 5 }}>
            Form Number: XYZ-001, Revision: A
          </Typography>
        </Paper>
      )}
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
      {isDetailedView ? (
        <SupplierDetailDialog open={dialogOpen} onClose={() => setDialogOpen(false)} vendor={details} />
      ) : (
        <SupplierScorecardDialog open={dialogOpen} onClose={() => setDialogOpen(false)} vendor={performance} />
      )}
    </Container>
  );
};

export default SupplierPerformanceScorecard;
