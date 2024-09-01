import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DepartmentPieChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/employees/active');
        const fetchedData = response.data;

        // Assume fetchedData is structured correctly for your needs
        const labels = fetchedData.map(d => d.departmentName);
        const data = fetchedData.map(d => d.activeEmployeesCount);

        setChartData({
          labels,
          datasets: [{
            label: 'Department Distribution',
            data,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9C27B0',
              '#FF9800', '#E0E0E0', '#FFEB3B', '#8BC34A', '#2196F3',
            ],
            hoverOffset: 4
          }]
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Department Employee Distribution',
        font: {
          size: 18,
        },
      },
    },
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Department Distribution
      </Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <Box sx={{ height: '400px', width: '100%', maxWidth: '500px' }}>
          <Pie data={chartData} options={options} />
        </Box>
      )}
    </Box>
  );
};

export default DepartmentPieChart;

