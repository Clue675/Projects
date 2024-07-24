import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', cost: 4000 },
  { name: 'Feb', cost: 3000 },
  { name: 'Mar', cost: 2000 },
  { name: 'Apr', cost: 2780 },
  { name: 'May', cost: 1890 },
];

const CostOfRejectionsChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="cost" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CostOfRejectionsChart;
