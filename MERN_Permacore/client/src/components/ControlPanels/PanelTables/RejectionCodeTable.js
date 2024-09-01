import * as React from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Typography, Paper, Button } from '@mui/material';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const RejectionCodeTable = ({ codes, onEdit, onDelete }) => {
  const columns = [
    { field: 'codeId', headerName: 'Code ID', width: 150 },
    { field: 'codeNumber', headerName: 'Code Number', width: 150 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'description', headerName: 'Description', width: 300 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <Button variant="contained" color="primary" size="small" onClick={() => onEdit(params.row)}>
            Edit
          </Button>
          <Button variant="contained" color="secondary" size="small" onClick={() => onDelete(params.row._id)} style={{ marginLeft: 8 }}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%', backgroundColor: '#f9f9f9', padding: 2, borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>Rejection Codes</Typography>
      <Paper sx={{ height: '100%', width: '100%', padding: 2 }}>
        <DataGrid
          rows={codes}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          getRowId={(row) => row._id}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Paper>
    </Box>
  );
};

export default RejectionCodeTable;
