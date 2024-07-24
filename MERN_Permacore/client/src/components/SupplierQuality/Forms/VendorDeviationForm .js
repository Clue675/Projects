import React, { useState } from 'react';
import { Container, TextField, FormGroup, FormControlLabel, Checkbox, Button } from '@mui/material';

const VendorDeviationForm = () => {
  const [formData, setFormData] = useState({
    requestorSection: {
      organizationRequestingDeviation: '',
      partNumberAndRevision: '',
      // Continue initializing all fields...
    },
    approvingOrganizationSection: {
      isApproved: false,
      // Continue initializing all fields...
    },
    // Initialize other sections similarly...
  });

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    const [section, key] = name.split(".");

    setFormData(prevFormData => ({
      ...prevFormData,
      [section]: {
        ...prevFormData[section],
        [key]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here, submit formData to your backend
    console.log(formData);
  };

  return (
    <Container component="form" onSubmit={handleSubmit} maxWidth="md">
      {/* Text Fields for Requestor Section */}
      <TextField
        label="Organization Requesting Deviation"
        name="requestorSection.organizationRequestingDeviation"
        value={formData.requestorSection.organizationRequestingDeviation}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      {/* Repeat for other fields */}
      
      {/* Checkboxes for Deviation Type */}
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.requestorSection.deviationType.jobOnly}
              onChange={handleChange}
              name="requestorSection.deviationType.jobOnly"
            />
          }
          label="This Job Only"
        />
        {/* Repeat for other checkboxes */}
      </FormGroup>

      {/* Buttons for Form Submission */}
      <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
    </Container>
  );
};

export default VendorDeviationForm;
