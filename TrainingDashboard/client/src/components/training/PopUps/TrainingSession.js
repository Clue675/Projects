import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

const AttendeeForm = () => {
  const [trainingSession, setTrainingSession] = React.useState({
    title: "",
    trainerName: "",
    date: "",
    description: "",
    attendees: [],
    firstName: "",
    lastName: "",
    badgeNumber: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(trainingSession);
    // Your logic for submitting the training session data can go here
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTrainingSession({ ...trainingSession, [name]: value });
  };

  const handleAddAttendee = () => {
    // Your logic for adding an attendee to the training session can go here
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Training Session Form
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              autoFocus
              value={trainingSession.title}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="trainerName"
              label="Trainer Name"
              value={trainingSession.trainerName}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="date"
              label="Date"
              type="date"
              value={trainingSession.date}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={4}
              name="description"
              label="Description"
              value={trainingSession.description}
              onChange={handleInputChange}
            />
            <Typography variant="h6">Add Attendee</Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="firstName"
              label="First Name"
              value={trainingSession.firstName}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="lastName"
              label="Last Name"
              value={trainingSession.lastName}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="badgeNumber"
              label="Badge Number"
              value={trainingSession.badgeNumber}
              onChange={handleInputChange}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              onClick={handleAddAttendee}
            >
              Add Attendee
            </Button>
            <Grid container>
              {/* Additional UI components if needed */}
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AttendeeForm;
