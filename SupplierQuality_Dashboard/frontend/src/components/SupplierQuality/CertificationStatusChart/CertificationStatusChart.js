import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Card, CardContent, Typography, useTheme } from '@mui/material';

// Custom Toolbar for DataGrid
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

// EnhancedDataDisplay Component
export default function EnhancedDataDisplay() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/supplier_quality/records');
        // Process the data for the grid
        const processedData = response.data.map((item, index) => ({
          id: index,
          vendorName: item.vendorName, // Adjust based on your API response
          qualityScore: item.qualityScore,
          deliveryScore: item.deliveryScore,
          // ... more fields if needed
        }));

        setTableData(processedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        // Handle error
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'vendorName', headerName: 'Vendor Name', width: 150 },
    { field: 'qualityScore', headerName: 'Quality Score', type: 'number', width: 130 },
    { field: 'deliveryScore', headerName: 'Delivery Score', type: 'number', width: 130 },
    // ... more columns as needed
  ];

  return (
    <div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={tableData}
          columns={columns}
          pageSize={5}
          loading={loading}
          components={{ Toolbar: CustomToolbar }}
        />
      </div>
    </div>
  );
}
