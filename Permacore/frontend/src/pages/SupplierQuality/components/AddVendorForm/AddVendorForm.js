import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

export default function AddVendor() {
  const [vendorData, setVendorData] = useState({
    vendorName: '',
    email: '',
    address: '',
    phone: '',
    // Add other fields as necessary
  });
  const [certificationFile, setCertificationFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
  };

  const handleFileChange = (e) => {
    setCertificationFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('vendorData', JSON.stringify(vendorData));
    if (certificationFile) {
      formData.append('certification', certificationFile);
    }

    try {
      await axios.post('/vendors/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Reset form after successful submission
      setVendorData({
        vendorName: '',
        email: '',
        address: '',
        phone: '',
        // Reset other fields as necessary
      });
      setCertificationFile(null);
      alert('Vendor added successfully');
    } catch (error) {
      console.error('Error adding vendor:', error);
      alert('Error adding vendor');
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography variant="h6">Add Vendor</Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Vendor Name"
        name="vendorName"
        value={vendorData.vendorName}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Email Address"
        name="email"
        value={vendorData.email}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Address"
        name="address"
        value={vendorData.address}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Phone Number"
        name="phone"
        value={vendorData.phone}
        onChange={handleChange}
      />
      {/* Add other fields here */}
      <input
        accept="application/pdf"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="outlined" component="span" fullWidth sx={{ mt: 2 }}>
          Upload Certification (PDF)
        </Button>
      </label>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Add Vendor
      </Button>
    </Box>
  );
}
