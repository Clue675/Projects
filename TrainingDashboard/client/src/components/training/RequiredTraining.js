import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const TrainingManagement = () => {
  const [trainings, setTrainings] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [newTraining, setNewTraining] = useState({
    title: "",
    description: "",
    departments: [],
    frequency: "",
  });

  const frequencies = [
    "Annually",
    "Semi-Annually",
    "Quarterly",
    "Monthly",
    "Weekly",
    "Daily",
  ];

  // Fetch Trainings
  useEffect(() => {
    const fetchTrainings = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/required-trainings");
        setTrainings(response.data);
      } catch (error) {
        console.error("Error fetching trainings:", error);
        setSnackbar({
          open: true,
          message: "Failed to fetch trainings",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTrainings();
  }, []);

  // Fetch Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await axios.get("/api/departments");
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const handleDialogOpen = (training = null) => {
    setIsEdit(Boolean(training));
    setCurrentEditingId(training ? training.id : null);

    const departments =
      training && training.departments
        ? training.departments.map((dept) => ({
            id: dept.id,
            name: dept.name,
          }))
        : [];

    setNewTraining({
      title: training ? training.title : "",
      departments: departments,
      frequency: training ? training.frequency : "",
    });

    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTraining({ ...newTraining, [name]: value });
  };

  const handleDepartmentChange = (event) => {
    setNewTraining({ ...newTraining, departments: event.target.value });
  };

  const handleSubmit = async () => {
    // Define the fetchTrainings function within handleSubmit so it's accessible
    const fetchTrainings = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/required-trainings");
        setTrainings(response.data);
      } catch (error) {
        console.error("Error fetching trainings:", error);
        setSnackbar({
          open: true,
          message: "Failed to fetch trainings",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    try {
      const method = isEdit ? "put" : "post";
      const url = isEdit
        ? `/api/required-trainings/${currentEditingId}`
        : "/api/required-trainings";
    
      const payload = {
        title: newTraining.title,
        description: newTraining.description,
        departments: newTraining.departments,
        frequency: newTraining.frequency,
      };
    
      const response = await axios[method](url, payload);
    
      if (response.status === 200 || response.status === 201) {
        const message = isEdit ? "Training successfully updated" : "Training successfully saved";
        setSnackbar({
          open: true,
          message: message,
          severity: "success",
        });
        // Call fetchTrainings to update the UI
        await fetchTrainings();
      } else {
        // Handle any statuses other than 200 or 201
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error saving training:", error);
      setSnackbar({
        open: true,
        message: "Failed to save training",
        severity: "error",
      });
    } finally {
      handleDialogClose();
    }
    
  };

  const handleEdit = async (id) => {
    // Logic to open the edit dialog with the selected training's data
    const trainingToEdit = trainings.find((training) => training._id === id);
    if (trainingToEdit) {
      const departmentsWithDetails = trainingToEdit.departments
        ? trainingToEdit.departments.map((dept) => ({
            id: dept._id, // Assuming you have the id as _id
            name: dept.name, // Assuming you store name in the department object
          }))
        : [];

      setNewTraining({
        title: trainingToEdit.title,
        departments: departmentsWithDetails, // Updated to include detailed department objects
        frequency: trainingToEdit.frequency,
      });
      setCurrentEditingId(id);
      setIsEdit(true);
      setDialogOpen(true);
    } else {
      console.error(`Training with ID ${id} not found.`);
    }
  };

  const handleDelete = async (id) => {
    // Logic to delete the training
    try {
      const response = await axios.delete(`/api/required-trainings/${id}`);
      if (response.status === 204) {
        // Display success message
        setSnackbar({
          open: true,
          message: "Training successfully deleted",
          severity: "success",
        });

        // Remove the deleted training from the local state to update UI immediately
        setTrainings((prevTrainings) =>
          prevTrainings.filter((training) => training._id !== id)
        );

        // Optionally, if there are related entities that depend on this training,
        // here would be the place to trigger updates for those entities.
        // For example, refreshing a list of employees who might have been assigned this training.
        // fetchEmployeesOrRelatedData();
      } else {
        // Handle unexpected response status
        console.error(`Unexpected response status: ${response.status}`);
        setSnackbar({
          open: true,
          message: `Unexpected error occurred`,
          severity: "error",
        });
      }
    } catch (error) {
      // More descriptive error handling
      let errorMessage = "Failed to delete training";
      if (error.response) {
        // Server responded with a status code that falls out of the range of 2xx
        console.error(
          "Server responded with an error:",
          error.response.status,
          error.response.data
        );
        errorMessage += `: ${error.response.data.message || "Server error"}`;
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        errorMessage += ": No response from server";
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up the request:", error.message);
        errorMessage += `: ${error.message}`;
      }

      // Display the error message
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  };

  const columns = [
    { field: "title", headerName: "Title", width: 200 },
    {
      field: "departments",
      headerName: "Departments",
      width: 300,
      valueGetter: (params) => {
        // Assuming departments are an array of objects with 'name' properties
        return params.row.departments && params.row.departments.length > 0
          ? params.row.departments.map((dept) => dept.name).join(", ")
          : "No Departments";
      },
    },
    { field: "frequency", headerName: "Frequency", width: 150 },
    {
      field: "description", // Add this new column definition for description
      headerName: "Description",
      width: 300, // You can adjust the width as needed
      valueGetter: (params) => params.row.description || "No Description", // Assuming the description is directly on the row object
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row._id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDelete(params.row._id)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDialogOpen()}
      >
        Add New Training
      </Button>
      <DataGrid
        rows={trainings}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row._id} // Specify how to extract the row ID
        components={{
          Toolbar: GridToolbar,
        }}
        loading={loading}
      />
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {isEdit ? "Edit Training" : "Add New Training"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Training Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newTraining.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={newTraining.description}
            onChange={handleInputChange} // Make sure this handler updates the newTraining state correctly
            multiline
            rows={4}
          />

          <FormControl fullWidth>
            <InputLabel id="department-select-label">Departments</InputLabel>
            <Select
              labelId="department-select-label"
              multiple
              value={newTraining.departments}
              onChange={handleDepartmentChange}
              renderValue={(selected) =>
                selected
                  .map(
                    (deptId) =>
                      departments.find((dept) => dept._id === deptId)?.name ||
                      ""
                  )
                  .join(", ")
              }
            >
              {departments.map((department) => (
                <MenuItem key={department._id} value={department._id}>
                  {department.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="frequency-select-label">Frequency</InputLabel>
            <Select
              labelId="frequency-select-label"
              name="frequency"
              value={newTraining.frequency}
              onChange={handleInputChange}
            >
              {frequencies.map((frequency) => (
                <MenuItem key={frequency} value={frequency}>
                  {frequency}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEdit ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TrainingManagement;
