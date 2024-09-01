import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Card, CardContent, Typography } from '@mui/material';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function EnhancedDataDisplay() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching data from the API
    axios.get('http://localhost:5000/api/records')
      .then(response => {
        // Processing the API response for the DataGrid
        const processedData = response.data.records.map((item, index) => ({
          id: index + 1,
          vendorId: item[1],
          qualityScore: item[2],
          recordDate: item[3],
          notes: item[4]
        }));

        setTableData(processedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  // Column definitions for DataGrid with centered text
  const columns = [
    { field: 'id', headerName: 'ID', width: 70, align: 'center', headerAlign: 'center' },
    { field: 'vendorId', headerName: 'Vendor ID', width: 150, align: 'center', headerAlign: 'center' },
    { field: 'qualityScore', headerName: 'Quality Score', type: 'number', width: 130, align: 'center', headerAlign: 'center' },
    { field: 'recordDate', headerName: 'Record Date', width: 150, align: 'center', headerAlign: 'center' },
    { field: 'notes', headerName: 'Notes', width: 200, align: 'center', headerAlign: 'center' },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Supplier Quality Data
        </Typography>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={tableData}
            columns={columns}
            pageSize={5}
            loading={loading}
            components={{ Toolbar: CustomToolbar }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
