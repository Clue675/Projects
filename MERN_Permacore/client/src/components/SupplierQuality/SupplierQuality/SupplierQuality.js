import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Tooltip,
  TextField
} from '@mui/material';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const SupplierQuality = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState('Q1');
  const [month, setMonth] = useState('January');
  const [qualityChartData, setQualityChartData] = useState([]);
  const [vendorSearch, setVendorSearch] = useState('');
  const [vendorData, setVendorData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // You should replace these API endpoints with the correct ones from your backend
        const response = await axios.get(`${API_BASE_URL}/supplierQuality?year=${year}&quarter=${quarter}&month=${month}`);
        setQualityChartData(response.data);
      } catch (error) {
        console.error('Error fetching quality data:', error);
      }
    };

    fetchData();
  }, [year, quarter, month]);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = async () => {
    // Implement your export functionality here
    console.log('Exporting data...');
  };

  const handleVendorSearch = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vendors/search`, {
        params: { search: vendorSearch },
      });
      setVendorData(response.data); // Assuming the API returns vendor data
    } catch (error) {
      console.error('Error searching for vendor:', error);
    }
  };

  // Chart component
  const renderQualityChart = (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={qualityChartData}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="month" />
        <YAxis />
        <RechartsTooltip />
        <Legend />
        <Line type="monotone" dataKey="quality" stroke="#8884d8" />
        <Line type="monotone" dataKey="delivery" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom component="div">
        Supplier Quality Information
      </Typography>

      {/* Search for Vendor */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search Vendor"
          value={vendorSearch}
          onChange={(e) => setVendorSearch(e.target.value)}
          variant="outlined"
          sx={{ m: 1 }}
        />
        <Button variant="contained" onClick={handleVendorSearch} sx={{ m: 1 }}>
          Search
        </Button>
      </Box>

      {/* Vendor Data Display */}
      {vendorData && (
        <Paper sx={{ p: 2, mb: 2 }}>
          {/* Display vendor data here */}
        </Paper>
      )}

      {/* Year, Quarter, Month Selectors */}
      {/* ... existing selectors code ... */}

      {/* Chart */}
      <Paper sx={{ p: 2, mb: 2 }}>
        {renderQualityChart}
      </Paper>

      {/* Print and Export Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', m: 2 }}>
        <Button variant="outlined" onClick={handlePrint} sx={{ mr: 1 }}>
          Print
        </Button>
        <Button variant="outlined" onClick={handleExport}>
          Export
        </Button>
      </Box>
    </Box>
  );
};

export default SupplierQuality;
