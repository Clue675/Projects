import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Text } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const KanbanChart = ({ tasks }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (tasks) {
            const data = [
                { name: 'To Do', value: tasks.todo.length },
                { name: 'In Progress', value: tasks.inProgress.length },
                { name: 'Done', value: tasks.done.length },
            ];
            setChartData(data);
        }
    }, [tasks]);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="30%"
                    outerRadius="40%"
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default KanbanChart;
