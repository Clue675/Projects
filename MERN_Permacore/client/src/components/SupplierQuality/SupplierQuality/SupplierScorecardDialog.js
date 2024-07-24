// SupplierScorecardDialog.js
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

function SupplierScorecardDialog({ open, onClose, vendor }) {
  if (!vendor) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        <Typography variant="h6" align="center" gutterBottom>
          Supplier Performance Scorecard
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          {vendor.vendorName} - Supplier Evaluation
        </Typography>
        <Typography variant="body2" align="center" gutterBottom>
          Rating Period: {vendor.ratingPeriod}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" align="center">Overall Rating</Typography>
              <Typography variant="h4" align="center">{vendor.overallRating}%</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" align="center">Quality Rating</Typography>
              <Typography variant="h4" align="center">{vendor.qualityRating}%</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" align="center">Delivery Rating</Typography>
              <Typography variant="h4" align="center">{vendor.deliveryRating}%</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Quantity Accepted: {vendor.quantityAccepted}</Typography>
            <Typography variant="body1">Quantity Rejected: {vendor.quantityRejected}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">PO Received: {vendor.poReceived}</Typography>
            <Typography variant="body1">PO Received On-Time: {vendor.poReceivedOnTime}</Typography>
          </Grid>
        </Grid>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button onClick={() => window.print()}>Print</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

export default SupplierScorecardDialog;
