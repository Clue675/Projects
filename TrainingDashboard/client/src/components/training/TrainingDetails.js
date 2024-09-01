import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  TextField,
  Toolbar,
  Snackbar,
  Alert,
  TablePagination,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const TrainingDetails = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await axios.get("/api/trainings/records", {
          params: { populateAttendees: "true" },
        });
        const { data } = response;
        
        // Check if data is an object with a 'data' array property
        if (!data || !Array.isArray(data.data)) {
          setError("Invalid data received from the server.");
          console.error("Invalid data received from the server:", data);
          return;
        }
    
        const formattedTrainings = data.data.map((training) => ({
          ...training,
          date: new Date(training.date).toLocaleDateString("en-US"),
          open: false,
        }));
        setTrainings(formattedTrainings);
      } catch (err) {
        setError("Failed to fetch trainings.");
        console.error("Error fetching trainings:", err);
      } finally {
        setLoading(false);
      }
    };
    
    

    fetchTrainings();
  }, []);

  const handleOpen = (id) => {
    setTrainings(
      trainings.map((training) =>
        training.id === id ? { ...training, open: !training.open } : training
      )
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Toolbar>
        <TextField
          fullWidth
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Toolbar>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Title</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Attendees</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainings
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .filter((training) =>
                training.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((training, index) => (
                <React.Fragment key={index}>
                  <TableRow
                    key={training.id}
                    sx={{ "& > *": { borderBottom: "unset" } }}
                  >
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleOpen(training.id)}
                      >
                        {training.open ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {training.title}
                    </TableCell>
                    <TableCell align="right">{training.date}</TableCell>
                    <TableCell align="right">
                      {training.attendees.length}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse in={training.open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Typography variant="h6" gutterBottom component="div">
                            Attendees
                          </Typography>
                          <Table size="small" aria-label="attendees">
                            <TableHead>
                              <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Department</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {training.attendees.map((attendee, index) => (
                                <TableRow key={index}>
                                  <TableCell>{attendee.fullName}</TableCell>
                                  <TableCell>
                                    {attendee.department}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={trainings.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default TrainingDetails;
