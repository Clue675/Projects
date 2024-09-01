import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const TrainingForm = () => {
  const [trainingSession, setTrainingSession] = useState({
    title: "",
    trainerName: "",
    date: "",
    description: "",
    attendees: [],
    requiredTraining: "",
    firstName: "",
    lastName: "",
    badgeNumber: "",
  });

  const [editable, setEditable] = useState(true);
  const [error, setError] = useState("");
  const [requiredTrainings, setRequiredTrainings] = useState([]);

  useEffect(() => {
    // Fetch required training titles on component mount
    const fetchRequiredTrainings = async () => {
      try {
        const response = await axios.get("/api/required-trainings");
        // Adjust based on your actual API endpoint and response structure
        const formattedTrainings = response.data.map((training) => ({
          _id: training._id,
          title: training.title,
          description: training.description,
          date: "", // Add a date property to match the expected structure
        }));
        setRequiredTrainings(formattedTrainings);
      } catch (error) {
        console.error("Failed to fetch required trainings:", error);
        // Handle the error appropriately
      }
    };

    fetchRequiredTrainings();
  }, []);

  const handleTrainingChange = (e) => {
    const { name, value } = e.target;
    setTrainingSession((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "requiredTraining") {
      handleRequiredTrainingSelection(value);
    }
  };

  const handleRequiredTrainingSelection = (selectedTitle) => {
    const selectedTraining = requiredTrainings.find(
      (training) => training.title === selectedTitle
    );

    if (selectedTraining) {
      setTrainingSession((prev) => ({
        ...prev,
        title: selectedTraining.title,
        description: selectedTraining.description,
      }));
    } else {
      setTrainingSession((prev) => ({
        ...prev,
        title: "",
        description: "",
      }));
    }
  };

  const addAttendee = async () => {
    if (
      !trainingSession.badgeNumber.trim() &&
      (!trainingSession.firstName.trim() || !trainingSession.lastName.trim())
    ) {
      setError(
        "Please provide either a badge number or both first name and last name."
      );
      return;
    }

    let payload = {
      badgeNumber: trainingSession.badgeNumber.trim(),
      firstName: trainingSession.firstName.trim(),
      lastName: trainingSession.lastName.trim(),
    };

    try {
      const response = await axios.post("/api/trainings/validate", payload);
      if (response.data) {
        // Assuming response.data includes a 'department' object with 'name' and potentially other details
        const attendeeWithDepartment = {
          ...response.data,
          department: response.data.department, // Assuming the department object is directly included in the response
        };

        setTrainingSession((prevState) => ({
          ...prevState,
          attendees: [...prevState.attendees, attendeeWithDepartment],
          firstName: "",
          lastName: "",
          badgeNumber: "",
        }));
        setError(""); // Clear any existing errors
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Validation error:", error);
    }
  };

  // Function to validate attendee information
  const validateAttendeeInfo = (attendees) => {
    return attendees.every(
      (attendee) =>
        attendee.badgeNumber || (attendee.firstName && attendee.lastName)
    );
  };

  const submitTrainingSession = async () => {
    try {
      // Validate training session data
      if (!validateAttendeeInfo(trainingSession.attendees)) {
        console.error("Invalid attendee information.");
        return;
      }

      // Prepare session data to send to the backend
      const sessionData = prepareSessionData(trainingSession);

      // Send session data to the backend API
      const response = await axios.post("/api/trainings/session", sessionData);

      // Handle successful submission
      handleSubmissionSuccess(response.data);
    } catch (error) {
      // Handle error
      handleSubmissionError(error);
    }
  };

  const prepareSessionData = (trainingSession) => {
    // Ensure that each attendee has a 'badgeNumber' even if it's an empty string to prevent backend errors
    const attendeesWithBadge = trainingSession.attendees.map((attendee) => ({
      ...attendee,
      badgeNumber: attendee.badgeNumber || "", // Ensure badgeNumber is always sent, even as an empty string
    }));

    return {
      title: trainingSession.title,
      trainerName: trainingSession.trainerName,
      date: trainingSession.date,
      description: trainingSession.description,
      attendees: attendeesWithBadge,
    };
  };

  const handleSubmissionSuccess = (response) => {
    // Log success message
    console.log("Training session submitted successfully:", response);

    // Clear the list of attendees on successful submission
    setTrainingSession((prevState) => ({
      ...prevState,
      attendees: [],
    }));
  };

  const handleSubmissionError = (error) => {
    // Log error message
    console.error("Error submitting training session:", error);
    // Handle error accordingly, perhaps by displaying an error message to the user
  };

  const exportToExcel = () => {
    const { title, trainerName, date } = trainingSession;
    const formattedDate = new Date(date).toLocaleDateString(); // Format date as needed

    const wsData = trainingSession.attendees.map((attendee) => ({
      "Training Title": title,
      "Trainer Name": trainerName,
      "Training Date": formattedDate,
      "First Name": attendee.firstName,
      "Last Name": attendee.lastName,
      "Badge Number": attendee.badgeNumber,
      "Department Name": attendee.department,
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendees");

    const wbout = XLSX.write(wb, {
      type: "array",
      bookType: "xlsx",
    });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "TrainingSession.xlsx"
    );
  };

  const removeAttendee = (indexToRemove) => {
    setTrainingSession((prevSession) => ({
      ...prevSession,
      attendees: prevSession.attendees.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Training Session Form
      </Typography>
      <Typography variant="h6" gutterBottom>
        Add Attendee
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            label="First Name"
            name="firstName"
            value={trainingSession.firstName}
            onChange={handleTrainingChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Last Name"
            name="lastName"
            value={trainingSession.lastName}
            onChange={handleTrainingChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Badge Number"
            name="badgeNumber"
            value={trainingSession.badgeNumber}
            onChange={handleTrainingChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={addAttendee}
            variant="contained"
            color="primary"
            style={{ margin: "10px 0" }}
          >
            Add Attendee
          </Button>
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Typography color="error">{error}</Typography>
          </Grid>
        )}
      </Grid>
      <Paper style={{ padding: "20px", marginBottom: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              name="title"
              value={trainingSession.title}
              onChange={handleTrainingChange}
              fullWidth
              margin="normal"
              disabled={!editable}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Required Training"
              name="requiredTraining"
              value={trainingSession.requiredTraining}
              onChange={handleTrainingChange}
              fullWidth
              margin="normal"
              disabled={!editable}
            >
              {requiredTrainings.length > 0 ? (
                requiredTrainings.map((training) => (
                  <MenuItem key={training._id} value={training.title}>
                    {training.title}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Available Trainings</MenuItem>
              )}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Trainer Name"
              name="trainerName"
              value={trainingSession.trainerName}
              onChange={handleTrainingChange}
              fullWidth
              margin="normal"
              disabled={!editable}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={trainingSession.date}
              onChange={handleTrainingChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              disabled={!editable}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={trainingSession.description}
              onChange={handleTrainingChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              disabled={!editable}
            />
          </Grid>
          <Grid item xs={12}>
            <IconButton onClick={() => setEditable(!editable)}>
              {editable ? <LockOpenIcon /> : <LockIcon />}
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      <Paper style={{ margin: "20px 0", padding: "20px" }}>
        <Typography variant="h6">Attendees</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Badge Number</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainingSession.attendees.map((attendee, index) => (
              <TableRow key={index}>
                <TableCell>{attendee.firstName}</TableCell>
                <TableCell>{attendee.lastName}</TableCell>
                <TableCell>{attendee.badgeNumber}</TableCell>
                <TableCell>
                  {attendee.department ? attendee.department.name : "N/A"}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => removeAttendee(index)}
                    variant="outlined"
                    color="secondary"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <IconButton onClick={exportToExcel}>
          <FileDownloadIcon />
        </IconButton>
        <Button
          onClick={submitTrainingSession}
          variant="contained"
          color="primary"
          disabled={
            !trainingSession.title ||
            !trainingSession.trainerName ||
            !trainingSession.date ||
            trainingSession.attendees.length === 0
          }
        >
          Submit Training Session
        </Button>
      </Paper>
    </Container>
  );
};

export default TrainingForm;
