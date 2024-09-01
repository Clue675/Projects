import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchEmployees();
    fetchDivisions();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/employees");
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response data for employees");
      }
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchDivisions = async () => {
    try {
      const response = await axios.get("/api/divisions");
      setDivisions(response.data);
    } catch (error) {
      console.error("Error fetching divisions:", error);
    }
  };

  const fetchDepartments = async (divisionId) => {
    try {
      const response = await axios.get(`/api/departments/by-division/${divisionId}`);
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response data for departments");
      }
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    }
  };

  const handleInputChange = (e) => {
    setCurrentEmployee({ ...currentEmployee, [e.target.name]: e.target.value });
  };

  const handleDivisionChange = (event) => {
    const divisionId = event.target.value;
    const selectedDivision = divisions.find((d) => d._id === divisionId);

    setCurrentEmployee({
      ...currentEmployee,
      division: divisionId,
      divisionName: selectedDivision ? selectedDivision.name : "",
    });

    fetchDepartments(divisionId);
  };

  const validateEmployeeData = (employee) => {
    if (!employee.department || !employee.division) {
      throw new Error("Please select both department and division");
    }
    if (!employee.firstName || !employee.lastName || !employee.badgeNumber) {
      throw new Error("Please fill in all the fields");
    }
  };

  const handleSubmit = async () => {
    try {
      validateEmployeeData(currentEmployee);

      const department = departments.find(d => d._id === currentEmployee.department);
      const division = divisions.find(d => d._id === currentEmployee.division);
      if (!department || !division) {
        throw new Error("Department details not found for the given division");
      }

      currentEmployee.departmentName = department.name;
      currentEmployee.divisionName = division.name;

      const { department: _, division: __, ...employeeData } = currentEmployee;

      await axios.post("/api/employees", employeeData);
      await updateDepartmentWithEmployee(currentEmployee);
      await updateDivisionWithEmployee(currentEmployee);

      setSnackbarMessage("Employee added successfully");
      setSnackbarOpen(true);
      fetchEmployees();
    } catch (error) {
      console.error("Error adding employee:", error);
      handleRequestError(error);
    }
    setOpenDialog(false);
  };

  const updateDepartmentWithEmployee = async (employee) => {
    try {
      const departmentId = employee.department;
      const department = departments.find(d => d._id === departmentId);
      if (!department) {
        throw new Error("Department not found for employee");
      }
      department.employees = department.employees || []; // Ensure employees array exists
      department.employees.push(employee._id);
      await axios.put(`/api/departments/${departmentId}`, department);
    } catch (error) {
      console.error("Error updating department with employee:", error);
      handleRequestError(error);
    }
  };
  
  const updateDivisionWithEmployee = async (employee) => {
    try {
      const divisionId = employee.division;
      const division = divisions.find(d => d._id === divisionId);
      if (!division) {
        throw new Error("Division not found for employee");
      }
      division.employees = division.employees || []; // Ensure employees array exists
      division.employees.push(employee._id);
      await axios.put(`/api/divisions/${divisionId}`, division);
    } catch (error) {
      console.error("Error updating division with employee:", error);
      handleRequestError(error);
    }
  };
  

  const handleUpdate = async (id) => {
    try {
      validateEmployeeData(currentEmployee);
      await axios.put(`/api/employees/${id}`, currentEmployee);
      setSnackbarMessage("Employee updated successfully");
      setSnackbarOpen(true);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
      handleRequestError(error);
    }
    setOpenDialog(false);
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await axios.put(`/api/employees/${id}`, {
        ...currentEmployee,
        isActive: !isActive,
      });
      fetchEmployees();
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Server responded with an error status:", error.response.status);
        console.error("Error response data:", error.response.data);
        handleRequestError(error.response.data); // Pass error response data to error handler
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from the server:", error.request);
        handleRequestError("No response received from the server"); // Pass custom error message to error handler
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error setting up the request:", error.message);
        handleRequestError("Error setting up the request"); // Pass custom error message to error handler
      }
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/employees/${id}`);
      setSnackbarMessage("Employee deleted successfully");
      setSnackbarOpen(true);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      handleRequestError(error);
    }
  };

  const columns = [
    { field: "firstName", headerName: "First Name", width: 130 },
    { field: "lastName", headerName: "Last Name", width: 130 },
    { field: "badgeNumber", headerName: "Badge Number", width: 130 },
    { field: "departmentName", headerName: "Department", width: 130 },
    { field: "divisionName", headerName: "Division", width: 130 },
    { field: "workCenter", headerName: "Work Center", width: 130 },
    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      renderCell: (params) => (
        <Button
          color="primary"
          onClick={() =>
            handleToggleActive(params.row._id, params.row.isActive)
          }
        >
          {params.row.isActive ? "Active" : "Inactive"}
        </Button>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            color="primary"
            onClick={() => {
              setOpenDialog(true);
              setCurrentEmployee(params.row);
            }}
          >
            Edit
          </Button>
          <Button
            color="secondary"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleRequestError = (error) => {
    setSnackbarMessage(error.message || "An error occurred");
    setSnackbarOpen(true);
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button variant="contained" onClick={() => setOpenDialog(true)}>
        Add New Employee
      </Button>
      <DataGrid
        rows={employees}
        columns={columns}
        pageSize={5}
        loading={loading}
        getRowId={(row) => row._id}
      />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {currentEmployee._id ? "Edit Employee" : "Add New Employee"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="firstName"
            label="First Name"
            fullWidth
            variant="outlined"
            value={currentEmployee.firstName || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="lastName"
            label="Last Name"
            fullWidth
            variant="outlined"
            value={currentEmployee.lastName || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="badgeNumber"
            label="Badge Number"
            fullWidth
            variant="outlined"
            value={currentEmployee.badgeNumber || ""}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Division</InputLabel>
            <Select
              value={currentEmployee.division || ""}
              onChange={handleDivisionChange}
              label="Division"
            >
              {divisions.map((division) => (
                <MenuItem key={division._id} value={division._id}>
                  {division.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Department</InputLabel>
            <Select
              value={currentEmployee.department || ""}
              onChange={(e) =>
                setCurrentEmployee({
                  ...currentEmployee,
                  department: e.target.value,
                  departmentName: departments.find(dep => dep._id === e.target.value)?.name || ''
                })
              }
              label="Department"
            >
              {departments.map((department) => (
                <MenuItem
                  key={`${department._id}-${department.name}`}
                  value={department._id}
                >
                  {department.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="workCenter"
            label="Work Center"
            fullWidth
            variant="outlined"
            value={currentEmployee.workCenter || ""}
            InputProps={{ readOnly: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() =>
              currentEmployee._id
                ? handleUpdate(currentEmployee._id)
                : handleSubmit()
            }
          >
            {currentEmployee._id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </div>
  );
};

export default Employee;
