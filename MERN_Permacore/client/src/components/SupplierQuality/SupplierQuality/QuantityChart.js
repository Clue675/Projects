import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', received: 4000, rejected: 2400 },
  { name: 'Feb', received: 3000, rejected: 1398 },
  { name: 'Mar', received: 2000, rejected: 9800 },
  { name: 'Apr', received: 2780, rejected: 3908 },
  { name: 'May', received: 1890, rejected: 4800 },
];

const QuantityChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="received" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="rejected" stroke="#82ca9d" fill="#82ca9d" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default QuantityChart;
