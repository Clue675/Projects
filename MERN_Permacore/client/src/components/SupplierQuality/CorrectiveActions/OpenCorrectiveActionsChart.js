import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Open', value: 400 },
  { name: 'Closed', value: 300 },
  { name: 'In Progress', value: 300 },
  { name: 'Pending', value: 200 },
];

const OpenCorrectiveActionsChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie dataKey="value" isAnimationActive={false} data={data} outerRadius={80} fill="#8884d8" label />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default OpenCorrectiveActionsChart;
