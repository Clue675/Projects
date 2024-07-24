import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Grid,
  Paper,
  Button,
  DialogActions
} from '@mui/material';

function SupplierDetailDialog({ open, onClose, vendor }) {
  if (!vendor) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        <Typography variant="h6" align="center" gutterBottom>
          Supplier Performance Results Based on Receiving Log Data
        </Typography>
        <Typography variant="body2" align="center" gutterBottom>
          Date Covered In This Report: From: {vendor.startDate} - To: {vendor.endDate}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {vendor.records?.map((record, index) => (
            <Grid item xs={12} key={index}>
              <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" align="center">Part Number: {record.partNumber}</Typography>
                <Typography variant="body1">PO Number: {record.poNumber}</Typography>
                <Typography variant="body1">Received Date: {record.receivedDate}</Typography>
                <Typography variant="body1">Quantity Received: {record.quantityReceived}</Typography>
                <Typography variant="body1">Quantity Rejected: {record.quantityRejected}</Typography>
                <Typography variant="body1">Quality Rating: {record.qualityRating}%</Typography>
                <Typography variant="body1">Delivery Rating: {record.deliveryRating}%</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button onClick={() => window.print()}>Print</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

export default SupplierDetailDialog;