// src/components/SupplierQuality/SupplierQuality/KPIChart.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const KPIChart = ({ timePeriod }) => {
  const [chartData, setChartData] = useState([]);
  const overallGoal = 97;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/kpi-data?period=${timePeriod}`);
        const data = response.data.map(item => ({
          ...item,
          goal: overallGoal,
        }));
        setChartData(data);
      } catch (error) {
        console.error('Error fetching KPI data:', error);
      }
    };

    fetchData();
  }, [timePeriod]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="KPI" fill="#82ca9d" />
        <Bar dataKey="goal" fill="#ff7300" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default KPIChart;
