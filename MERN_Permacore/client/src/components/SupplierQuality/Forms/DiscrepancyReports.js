import React, { forwardRef } from 'react';
import { Container, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField } from '@mui/material';

const InspectionReportPDF = forwardRef(({ data, handleAddReworkOperation, handleReworkChange, handleSave }, ref) => {
  return (
    <Container ref={ref}>
      <Typography variant="h4" gutterBottom>
        Discrepancy Report
      </Typography>
      <Typography variant="h6" style={{ textAlign: 'right' }}>
        {data?.reportId}
      </Typography>
      <Paper style={{ padding: 16, marginBottom: 16 }}>
        <Typography variant="h6">Shipment Details</Typography>
        <Grid container spacing={2}>
          {/* Shipment details grid */}
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
            <Typography variant="body1"><strong>Date Received:</strong> {data?.shipment?.dateReceived}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Quantity Shipped:</strong> {data?.shipment?.quantityShipped}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Unit Cost:</strong> {data?.shipment?.unitCost}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Expected Delivery Date:</strong> {data?.shipment?.expectedDeliveryDate}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Vendor Name:</strong> {data?.shipment?.vendorName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Vendor ID:</strong> {data?.shipment?.vendorId}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={{ padding: 16, marginBottom: 16 }}>
        <Typography variant="h6">Inspection Details</Typography>
        <Grid container spacing={2}>
          {/* Inspection details grid */}
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Inspector First Name:</strong> {data?.inspection?.inspectorFirstName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Inspector Last Name:</strong> {data?.inspection?.inspectorLastName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Inspector Badge Number:</strong> {data?.inspection?.inspectorBadgeNumber}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Quantity Received:</strong> {data?.inspection?.quantityReceived}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Quantity Accepted:</strong> {data?.inspection?.quantityAccepted}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Quantity Rejected:</strong> {data?.inspection?.quantityRejected}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>IS:</strong> {data?.inspection?.isDescription}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Should Be:</strong> {data?.inspection?.shouldBeDescription}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>At Fault:</strong> {data?.atFault}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Discrepancy Details:</strong> {data?.discrepancyDetails}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1"><strong>Total Cost:</strong> {data?.totalCost}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={{ padding: 16 }}>
        <Typography variant="h6">Rework Operations</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>OS</TableCell>
                <TableCell>Work Center</TableCell>
                <TableCell>Re-Work Instructions</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Operator ID</TableCell>
                <TableCell>Run Hr.</TableCell>
                <TableCell>Accept</TableCell>
                <TableCell>Reject</TableCell>
                <TableCell>Scrap</TableCell>
                <TableCell>First</TableCell>
                <TableCell>Final</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.reworkOperations.map((operation, index) => (
                <TableRow key={index}>
                  <TableCell><TextField value={operation.os} onChange={(e) => handleReworkChange(e, index, 'os')} /></TableCell>
                  <TableCell><TextField value={operation.workCenter} onChange={(e) => handleReworkChange(e, index, 'workCenter')} /></TableCell>
                  <TableCell><TextField value={operation.reworkInstructions} onChange={(e) => handleReworkChange(e, index, 'reworkInstructions')} /></TableCell>
                  <TableCell><TextField type="date" value={operation.date} onChange={(e) => handleReworkChange(e, index, 'date')} /></TableCell>
                  <TableCell><TextField value={operation.operatorId} onChange={(e) => handleReworkChange(e, index, 'operatorId')} /></TableCell>
                  <TableCell><TextField value={operation.runHr} onChange={(e) => handleReworkChange(e, index, 'runHr')} /></TableCell>
                  <TableCell><TextField value={operation.quantityAccept} onChange={(e) => handleReworkChange(e, index, 'quantityAccept')} /></TableCell>
                  <TableCell><TextField value={operation.quantityReject} onChange={(e) => handleReworkChange(e, index, 'quantityReject')} /></TableCell>
                  <TableCell><TextField value={operation.quantityScrap} onChange={(e) => handleReworkChange(e, index, 'quantityScrap')} /></TableCell>
                  <TableCell><TextField value={operation.inspectionFirst} onChange={(e) => handleReworkChange(e, index, 'inspectionFirst')} /></TableCell>
                  <TableCell><TextField value={operation.inspectionFinal} onChange={(e) => handleReworkChange(e, index, 'inspectionFinal')} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button onClick={handleAddReworkOperation}>Add Rework Operation</Button>
        <Button onClick={handleSave}>Save</Button>
      </Paper>
    </Container>
  );
});

export default InspectionReportPDF;
