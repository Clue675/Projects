import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Box, Tabs, Tab } from '@mui/material';
import KPIChart from '../components/SupplierQuality/SupplierQuality/KPIChart';
import RejectionByVendorChart from '../components/SupplierQuality/SupplierQuality/RejectionByVendorChart';
import QuantityChart from '../components/SupplierQuality/SupplierQuality/QuantityChart';
import OpenCorrectiveActionsChart from '../components/SupplierQuality/CorrectiveActions/OpenCorrectiveActionsChart';
import CostOfRejectionsChart from '../components/SupplierQuality/SupplierQuality/CostOfRejectionsChart';
import SupplierRejectionsTable from '../components/SupplierQuality/SupplierQuality/SupplierRejectionsTable';
import ControlBox from '../components/SupplierQuality/SupplierQuality/ControlBox';
import DiscrepancyReports from '../components/SupplierQuality/SupplierQuality/DiscrepancyReports';

const SupplierDashboard = () => {
  const [timePeriod, setTimePeriod] = useState('month');
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 2 }}>
        <Typography variant="h5" gutterBottom>
          Supplier Quality Metrics Dashboard
        </Typography>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Dashboard" />
          <Tab label="Discrepancy Reports" />
        </Tabs>
        {tabIndex === 0 && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <ControlBox timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <KPIChart timePeriod={timePeriod} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <RejectionByVendorChart timePeriod={timePeriod} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <QuantityChart timePeriod={timePeriod} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <OpenCorrectiveActionsChart timePeriod={timePeriod} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <CostOfRejectionsChart timePeriod={timePeriod} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <SupplierRejectionsTable timePeriod={timePeriod} />
              </Paper>
            </Grid>
          </Grid>
        )}
        {tabIndex === 1 && <DiscrepancyReports />}
      </Box>
    </Container>
  );
};

export default SupplierDashboard;
