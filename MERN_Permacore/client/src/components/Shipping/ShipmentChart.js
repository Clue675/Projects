import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ButtonGroup, Button } from '@mui/material';
import { format, parseISO, getQuarter } from 'date-fns';

// Register the necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ShipmentChart = () => {
  const [chartData, setChartData] = useState({ datasets: [] });
  const [timeFrame, setTimeFrame] = useState('month');

  useEffect(() => {
    const processShipmentData = (data) => {
      const timeFrameFormat = {
        month: 'MMM yyyy',
        quarter: (date) => `Q${getQuarter(date)} ${format(date, 'yyyy')}`,
        year: 'yyyy',
      };

      const aggregation = data.reduce((acc, { vendorName, quantityShipped, dateReceived }) => {
        const date = parseISO(dateReceived);
        const timeLabel = typeof timeFrameFormat[timeFrame] === 'function' ?
                          timeFrameFormat[timeFrame](date) : format(date, timeFrameFormat[timeFrame]);
        const key = `${vendorName} - ${timeLabel}`;
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += quantityShipped;
        return acc;
      }, {});

      const labels = Object.keys(aggregation);
      const quantities = Object.values(aggregation);

      setChartData({
        labels,
        datasets: [{
          label: `Total Quantity Shipped (${timeFrame})`,
          data: quantities,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }],
      });
    };

    const fetchShipmentData = async () => {
      try {
        const response = await axios.get('/api/shipments');
        processShipmentData(response.data);
      } catch (error) {
        console.error('Error fetching shipment data:', error);
      }
    };

    fetchShipmentData();
  }, [timeFrame]);

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: `Shipment Quantities by Vendor (${timeFrame.toUpperCase()})`,
      },
    },
  };

  const handleTimeFrameChange = (frame) => {
    setTimeFrame(frame);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto' }}>
      <h2>Shipment Data Chart</h2>
      <ButtonGroup color="primary" aria-label="time frame selection">
        <Button onClick={() => handleTimeFrameChange('month')} variant={timeFrame === 'month' ? 'contained' : 'outlined'}>Month</Button>
        <Button onClick={() => handleTimeFrameChange('quarter')} variant={timeFrame === 'quarter' ? 'contained' : 'outlined'}>Quarter</Button>
        <Button onClick={() => handleTimeFrameChange('year')} variant={timeFrame === 'year' ? 'contained' : 'outlined'}>Year</Button>
      </ButtonGroup>
      <div>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ShipmentChart;
