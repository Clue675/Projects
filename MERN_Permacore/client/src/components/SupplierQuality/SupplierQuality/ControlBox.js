// src/components/SupplierQuality/ControlBox.js
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ControlBox = ({ timePeriod, setTimePeriod }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Time Period</InputLabel>
      <Select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)}>
        <MenuItem value="month">Month</MenuItem>
        <MenuItem value="quarter">Quarter</MenuItem>
        <MenuItem value="year">Year</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ControlBox;