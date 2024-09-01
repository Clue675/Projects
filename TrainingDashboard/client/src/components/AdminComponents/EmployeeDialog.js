import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";

function EmployeeDialog({
  open,
  employee,
  divisions = [], // Ensuring default empty array if not provided
  departments = [], // Ensuring default empty array if not provided
  onSave,
  onClose,
}) {
  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    setFormData(employee || getInitialFormData());
  }, [employee]);

  function getInitialFormData() {
    return {
      firstName: "",
      lastName: "",
      badgeNumber: "",
      department: "",
      division: "",
      workCenter: "",
      isActive: true,
      completedTrainings: [],
      requiredTrainings: [],
    };
  }

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddTraining = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      completedTrainings: [
        ...prevFormData.completedTrainings,
        { title: "", completionDate: "" },
      ],
    }));
  };

  const handleTrainingChange = (index, e) => {
    const updatedTrainings = formData.completedTrainings.map((training, i) =>
      i === index ? { ...training, [e.target.name]: e.target.value } : training
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      completedTrainings: updatedTrainings,
    }));
  };

  const handleRemoveTraining = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      completedTrainings: prevFormData.completedTrainings.filter(
        (_, i) => i !== index
      ),
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {employee?._id ? "Edit Employee" : "Add Employee"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  name="isActive"
                />
              }
              label="Is Active"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                label="Department"
              >
                {Array.isArray(departments) &&
                  departments.map((dept) => (
                    <MenuItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Dynamic Training Fields */}
          {formData.completedTrainings.map((training, index) => (
            <React.Fragment key={index}>
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  label="Training Title"
                  name="title"
                  value={training.title}
                  onChange={(e) => handleTrainingChange(index, e)}
                />
              </Grid>
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  type="date"
                  label="Completion Date"
                  name="completionDate"
                  InputLabelProps={{ shrink: true }}
                  value={training.completionDate}
                  onChange={(e) => handleTrainingChange(index, e)}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  onClick={() => handleRemoveTraining(index)}
                  color="error"
                >
                  Remove
                </Button>
              </Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <Button onClick={handleAddTraining}>Add Training</Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave(formData)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EmployeeDialog;
