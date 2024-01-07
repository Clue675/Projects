import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Box, CircularProgress, Typography } from '@mui/material';


const CertificationTimelineChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/vendor-certifications')
      .then(response => {
        const labels = response.data.map(cert => cert.vendor_name + ' - ' + cert.certificate_name);
        const data = response.data.map(cert => {
          const issuedDate = new Date(cert.issued_date);
          const expirationDate = new Date(cert.expiration_date);
          return (expirationDate - issuedDate) / (1000 * 60 * 60 * 24); // Duration in days
        });

        setChartData({
          labels,
          datasets: [{
            label: 'Certification Duration (days)',
            data,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          }]
        });
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Bar data={chartData} options={{ indexAxis: 'y' }} />
    </Box>
  );
};

export default CertificationTimelineChart;
