import React from 'react';
import { Container, Grid, Paper } from '@mui/material';
import TrainingCompletionChart from '../dashboard/TrainingCompletionChart'; // Adjust path as needed
import TrainingDetails from '../training/TrainingDetails'; // Adjust path as needed
import RequiredTraining from '../training/RequiredTraining'; // Adjust path as needed
import TrainingForm from '../training/TrainingForm'; // Adjust path as needed

const DashboardContent = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* TrainingCompletionChart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <TrainingCompletionChart />
          </Paper>
        </Grid>
        {/* TrainingDetails */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <TrainingDetails />
          </Paper>
        </Grid>
        {/* RequiredTraining */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <RequiredTraining />
          </Paper>
        </Grid>
        {/* TrainingForm */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <TrainingForm />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardContent;
