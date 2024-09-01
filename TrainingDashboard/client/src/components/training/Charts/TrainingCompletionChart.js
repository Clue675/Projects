import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TrainingCompletionChart = () => {
  const [chartData, setChartData] = useState(null); // Initialize chartData as null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/training-metrics/completion-rate-by-department');
      const fetchedData = response.data.completionRates;

      if (!fetchedData || !Array.isArray(fetchedData)) {
        throw new Error('Incorrect data format received from the server.');
      }

      const labels = fetchedData.map(item => item.label);
      const data = fetchedData.map(item => parseFloat(item.rate));

      // Set the chart data using the processed labels and data
      setChartData({
        labels,
        datasets: [{
          label: 'Training Completion Rate by Department',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setError('Failed to load chart data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!chartData) return <div>No chart data available</div>;

  // Ensure chartData is defined before attempting to render the chart
  return (
    <div>
      <h2>Training Completion Rate by Department</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default TrainingCompletionChart;

