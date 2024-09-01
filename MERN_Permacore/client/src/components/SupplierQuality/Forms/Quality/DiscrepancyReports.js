import React, { forwardRef } from 'react';
import { Container, Typography, Grid, Paper, Button, Box, IconButton, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-cell': {
    whiteSpace: 'normal !important',
    wordWrap: 'break-word !important',
  },
}));

const InspectionReportPDF = forwardRef(({ data, handleAddReworkOperation, handleDeleteReworkOperation, handleReworkChange, handleSave }, ref) => {
  const columns = [
    { field: 'os', headerName: 'OS', width: 60, editable: true },
    { field: 'workCenter', headerName: 'Work Center', width: 150, editable: true },
    { field: 'reworkInstructions', headerName: 'Re-Work Instructions', width: 300, editable: true, renderCell: (params) => (
      <TextField
        multiline
        value={params.value}
        onChange={(e) => handleReworkChange(params.row.id, 'reworkInstructions', e.target.value)}
        sx={{ width: '100%' }}
      />
    )},
    { field: 'date', headerName: 'Date', width: 120, editable: true, type: 'date', valueGetter: (params) => new Date(params.value) },
    { field: 'operatorId', headerName: 'Operator ID', width: 120, editable: true },
    { field: 'runHr', headerName: 'Run Hr.', width: 80, editable: true },
    { field: 'quantityAccept', headerName: 'Accept', width: 80, editable: true },
    { field: 'quantityReject', headerName: 'Reject', width: 80, editable: true },
    { field: 'quantityScrap', headerName: 'Scrap', width: 80, editable: true },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 80,
      renderCell: (params) => (
        <IconButton onClick={() => handleDeleteReworkOperation(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      )
    }
  ];

  const rows = data?.reworkOperations?.map((operation, index) => ({ id: index, ...operation })) || [];

  return (
    <Container ref={ref} sx={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        Discrepancy Report
      </Typography>
      <Typography variant="h6" align="right" sx={{ marginBottom: '16px' }}>
        {data?.reportId}
      </Typography>
      <Paper sx={{ padding: '16px', marginBottom: '16px' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>
          Shipment Details
        </Typography>
        <Grid container spacing={2} sx={{ marginTop: '8px' }}>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Purchase Order Number:</strong> {data?.shipment?.purchaseOrderNumber}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Part Number:</strong> {data?.shipment?.partNumber}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Work Order Number:</strong> {data?.shipment?.workOrderNumber}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Rework Number:</strong> {data?.shipment?.reworkNumber}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Date Received:</strong> {new Date(data?.shipment?.dateReceived).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Quantity Shipped:</strong> {data?.shipment?.quantityShipped}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Unit Cost:</strong> {data?.shipment?.unitCost}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Expected Delivery Date:</strong> {new Date(data?.shipment?.expectedDeliveryDate).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Vendor Name:</strong> {data?.shipment?.vendorName}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ padding: '16px', marginBottom: '16px', pageBreakBefore: 'always' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>
          Rework Operations
        </Typography>
        <Box sx={{ height: 300, width: '100%' }}>
          <StyledDataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableColumnMenu
            hideFooter
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <Button variant="contained" color="primary" onClick={handleAddReworkOperation} sx={{ marginRight: '8px' }}>
            Add Rework Operation
          </Button>
          <Button variant="contained" color="secondary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Paper>
    </Container>
  );
});

export default InspectionReportPDF;
