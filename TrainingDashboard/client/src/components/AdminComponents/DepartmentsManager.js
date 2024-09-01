import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Select,
  MenuItem,
} from "@mui/material";

function DivisionDialog({ open, division, onClose, onSave, setSnackbar }) {
  const [formData, setFormData] = useState(division);

  useEffect(() => {
    setFormData(division);
  }, [division]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
      });
      return;
    }

    await onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {division._id ? "Edit Division" : "Add Division"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Division Name"
          type="text"
          fullWidth
          value={formData.name}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          value={formData.description}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={!formData.name.trim() || !formData.description.trim()}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DepartmentDialog({
  open,
  department,
  divisions,
  onClose,
  onSave,
  setSnackbar,
}) {
  const [formData, setFormData] = useState(department);
  const [workCenterName, setWorkCenterName] = useState("");

  useEffect(() => {
    setFormData(department);
  }, [department]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    // Construct complete department data, including workCenter
    const departmentData = {
      ...formData,
      workCenter: workCenterName, // Include workCenterName in the department data
    };

    // Check for missing required fields and provide specific feedback
    const missingFields = [];
    if (!departmentData.name) missingFields.push("name");
    if (!departmentData.description) missingFields.push("description");
    if (!departmentData.division) missingFields.push("division");
    if (!departmentData.workCenter) missingFields.push("workCenter");

    // Inform the user which specific fields are missing
    if (missingFields.length > 0) {
      setSnackbar({
        open: true,
        message: `Please fill in all required fields: ${missingFields.join(
          ", "
        )}`,
      });
      return;
    }

    try {
      // Attempt to save the department and provide feedback
      await onSave(departmentData);
      setSnackbar({
        open: true,
        message: `Department ${
          departmentData._id ? "updated" : "added"
        } successfully`,
      });
    } catch (error) {
      // Handle errors from the onSave function, including server responses
      console.error("Error submitting department:", error);
      const errorMessage = error.response
        ? error.response.data.message
        : "There was a problem saving the department.";
      setSnackbar({
        open: true,
        message: `Error: ${errorMessage}`,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {department._id ? "Edit Department" : "Add Department"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Department Name"
          type="text"
          fullWidth
          value={formData.name}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          value={formData.description}
          onChange={handleInputChange}
        />
        <Select
          value={formData.division}
          onChange={(e) =>
            setFormData({ ...formData, division: e.target.value })
          }
          fullWidth
          label="Division"
        >
          {divisions.map((division) => (
            <MenuItem key={division._id} value={division._id}>
              {division.name}
            </MenuItem>
          ))}
        </Select>

        <TextField
          margin="dense"
          name="workCenterName"
          label="Work Center Name"
          type="text"
          fullWidth
          value={workCenterName}
          onChange={(e) => setWorkCenterName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={!formData.name.trim() || !formData.description.trim()}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function DepartmentsManager() {
  const [divisions, setDivisions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [divisionDialogOpen, setDivisionDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState({
    name: "",
    description: "",
    division: "",
    workcenter: "",
  });
  const [currentDivision, setCurrentDivision] = useState({
    name: "",
    description: "",
  });
  const [currentView, setCurrentView] = useState("departments"); // Track the current view
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    fetchDivisions();
    fetchDepartments();
  }, []);

  const fetchDivisions = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get("/api/divisions");
      const divisionsWithIds = response.data.map((division, index) => ({
        ...division,
        id: index,
      }));
      setDivisions(divisionsWithIds);
    } catch (error) {
      console.error("Error fetching divisions:", error);
    } finally {
      setLoading(false); // Stop loading irrespective of the result
    }
  };

  const fetchDepartments = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get("/api/departments");
      const departmentsWithIds = response.data.map((department, index) => ({
        ...department,
        id: department._id || index, // Use MongoDB _id or index as the unique identifier
        division: department.division ? department.division.name : "", // Replace division ObjectID with division name if available
      }));
      setDepartments(departmentsWithIds);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false); // Stop loading irrespective of the result
    }
  };
  
  

  const handleDepartmentDialogOpen = () => {
    setCurrentDepartment({ name: "", description: "", division: "" });
    setDepartmentDialogOpen(true);
  };

  const handleDepartmentDialogClose = () => {
    setDepartmentDialogOpen(false);
  };

  const handleDivisionDialogOpen = () => {
    setCurrentDivision({ name: "", description: "" });
    setDivisionDialogOpen(true);
  };

  const handleDivisionDialogClose = () => {
    setDivisionDialogOpen(false);
  };

  const handleSaveDepartment = async (departmentData) => {
    const department = { ...departmentData };

    try {
      const missingFields = [
        "name",
        "description",
        "division",
        "workCenter",
      ].filter((field) => !department[field]);
      if (missingFields.length > 0) {
        throw new Error(
          `Missing required department fields: ${missingFields.join(", ")}`
        );
      }

      const isUpdating = Boolean(department._id);
      const method = isUpdating ? axios.put : axios.post;
      const url = `/api/departments${isUpdating ? `/${department._id}` : ""}`;

      // No need to assign the response to a variable if it's not used
      await method(url, department);

      setSnackbar({
        open: true,
        message: `Department ${isUpdating ? "updated" : "added"} successfully`,
      });

      fetchDepartments(); // Update departments after saving
    } catch (error) {
      console.error("Error submitting department:", error);
      const errorMessage = error.response
        ? error.response.data.message
        : error.message || "An unexpected error occurred.";

      setSnackbar({
        open: true,
        message: `Error: ${errorMessage}`,
      });
    } finally {
      handleDepartmentDialogClose();
    }
  };

  const handleSaveDivision = async (division) => {
    try {
      const method = division._id ? axios.put : axios.post;
      const url = division._id
        ? `/api/divisions/${division._id}`
        : "/api/divisions";
      await method(url, division);
      setSnackbar({
        open: true,
        message: `Division ${division._id ? "updated" : "added"} successfully`,
      });
      fetchDivisions(); // Update divisions after saving
    } catch (error) {
      console.error("Error submitting division:", error);
      setSnackbar({ open: true, message: "Error submitting division" });
    }
    handleDivisionDialogClose();
  };

  const columnsDivisions = [
    { field: "name", headerName: "Division Name", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    // Add more columns here as needed
  ];

  const columnsDepartments = [
    { field: "name", headerName: "Department Name", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "division", headerName: "Division", width: 200 }, // Make sure this matches the property name in department objects
    { field: "workCenter", headerName: "Work Center", width: 200 },
    // Add more columns here as needed
  ];
  

  const toggleView = () => {
    setCurrentView(currentView === "departments" ? "divisions" : "departments"); // Toggle between departments and divisions
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={{ flex: 1 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleView} // Switch button toggles the view
        >
          {currentView === "departments"
            ? "View Divisions"
            : "View Departments"}
        </Button>
        {currentView === "departments" ? ( // Render departments table if current view is departments
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDepartmentDialogOpen}
            >
              Add Department
            </Button>
            <DataGrid
              rows={departments}
              columns={columnsDepartments}
              pageSize={5}
              loading={loading}
              components={{ Toolbar: GridToolbar }}
            />
          </>
        ) : (
          // Render divisions table if current view is divisions
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDivisionDialogOpen}
            >
              Add Division
            </Button>
            <DataGrid
              rows={divisions}
              columns={columnsDivisions}
              pageSize={5}
              loading={loading}
              components={{ Toolbar: GridToolbar }}
            />
          </>
        )}
      </div>
      <DepartmentDialog
        open={departmentDialogOpen}
        department={currentDepartment}
        divisions={divisions}
        onClose={handleDepartmentDialogClose}
        onSave={handleSaveDepartment}
        setSnackbar={setSnackbar}
      />
      <DivisionDialog
        open={divisionDialogOpen}
        division={currentDivision}
        onClose={handleDivisionDialogClose}
        onSave={handleSaveDivision}
        setSnackbar={setSnackbar}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </div>
  );
}
