import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Switch, FormControlLabel, CircularProgress, Snackbar, Alert, Tooltip } from '@mui/material';
import { throttle } from 'lodash'; // Import throttle from lodash

const DailySimulationToggle = ({ debounceDelay = 500 }) => {
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState('Not Started');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const closeSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const runSimulation = async () => {
    setIsLoading(true);
    setSimulationStatus('Running');

    try {
      await axios.post('http://localhost:5000/api/run-simulation');
      setSimulationStatus('Completed');
      setSnackbar({ open: true, message: 'Simulation completed successfully', severity: 'success' });
    } catch (error) {
      console.error('Error during simulation:', error);
      setSimulationStatus('Failed');
      setSnackbar({ open: true, message: 'Simulation failed', severity: 'error' });
      setIsSimulationActive(false); // Reset toggle on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChange = useCallback(
    throttle(() => {
      setIsSimulationActive((prev) => {
        if (!prev) {
          runSimulation();
        } else {
          setSimulationStatus('Stopped');
        }
        return !prev;
      });
    }, debounceDelay),
    []
  );

  return (
    <>
      <Tooltip title="Toggle to start or stop the daily simulation">
        <FormControlLabel
          control={<Switch checked={isSimulationActive} onChange={handleToggleChange} disabled={isLoading} />}
          label={isLoading ? <CircularProgress size={22} /> : `Simulation: ${simulationStatus}`}
        />
      </Tooltip>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DailySimulationToggle;
