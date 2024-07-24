import React, { useState } from 'react';
import { Container, TextField, Button, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';

export default function SupplierSurveyForm() {
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierNumber: '',
    // Initialize other fields as needed...
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Submit formData to your backend...
  };

  return (
    <Container component="main" maxWidth="md">
      <Typography variant="h5">Supplier Survey Form</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          fullWidth
          label="Supplier Name"
          name="supplierName"
          value={formData.supplierName}
          onChange={handleInputChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Supplier Number"
          name="supplierNumber"
          value={formData.supplierNumber}
          onChange={handleInputChange}
        />
        {/* Render additional fields as needed... */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
}
