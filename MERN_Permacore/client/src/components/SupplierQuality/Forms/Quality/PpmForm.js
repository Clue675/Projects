import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Button, TextField, DatePicker, Table, TableBody, TableCell, TableHead, TableRow, Tooltip
} from '@mui/material';

const PPMReportComponent = () => {
  const [selectedDateFrom, setSelectedDateFrom] = useState(new Date());
  const [selectedDateTo, setSelectedDateTo] = useState(new Date());
  const [reportData, setReportData] = useState([]);

  const handleGenerateReport = async () => {
    const { data } = await axios.post('/api/reports/ppm', {
      dateFrom: selectedDateFrom,
      dateTo: selectedDateTo
    });
    setReportData(data);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Container>
      <h1>Generate PPM Report</h1>
      <DatePicker
        label="From"
        value={selectedDateFrom}
        onChange={setSelectedDateFrom}
        renderInput={(params) => <TextField {...params} />}
      />
      <DatePicker
        label="To"
        value={selectedDateTo}
        onChange={setSelectedDateTo}
        renderInput={(params) => <TextField {...params} />}
      />
      <Button onClick={handleGenerateReport}>Generate Report</Button>
      <Button onClick={handlePrint} style={{ marginLeft: '10px' }}>Print Report</Button>
      <Tooltip title="PPM is calculated as (Rejected Quantity / Received Quantity) * 1,000,000">
        <Button>How is PPM Calculated?</Button>
      </Tooltip>
      <div className="printableArea">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Supplier Name</TableCell>
              <TableCell>Received Qty</TableCell>
              <TableCell>Rejected Qty</TableCell>
              <TableCell>PPM</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((row) => (
              <TableRow key={row.supplierId}>
                <TableCell>{row.supplierName}</TableCell>
                <TableCell>{row.receivedQty}</TableCell>
                <TableCell>{row.rejectedQty}</TableCell>
                <TableCell>{row.ppm}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
};

export default PPMReportComponent;
