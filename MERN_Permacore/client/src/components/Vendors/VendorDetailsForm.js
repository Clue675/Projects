import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  TextField,
  Typography,
  IconButton,
  Button,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const VendorDetailsForm = ({ vendor, isEditMode, onEditToggle, onSaveSuccess }) => {
  const [vendorDetails, setVendorDetails] = useState({ ...vendor });
  const [certifications, setCertifications] = useState(vendor.certifications || []);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setVendorDetails({ ...vendor });
    setCertifications(vendor.certifications || []);
  }, [vendor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCertificationChange = (index, field, value) => {
    const newCertifications = [...certifications];
    newCertifications[index][field] = value;
    setCertifications(newCertifications);
  };

  const addCertification = () => {
    setCertifications([...certifications, { certificateName: "", certificateText: "", issuedBy: "", issuedDate: "", expirationDate: "", notes: "" }]);
  };

  const removeCertification = (index) => {
    const newCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(newCertifications);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/vendors/${vendorDetails._id}`, { ...vendorDetails, certifications });
      setSnackbarMessage("Vendor details updated successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      onSaveSuccess();
      onEditToggle();
    } catch (error) {
      setSnackbarMessage("Failed to update vendor details");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <form onSubmit={handleSave}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={isEditMode} onChange={onEditToggle} />}
            label="Edit Mode"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Vendor Name"
            value={vendorDetails.vendorName}
            onChange={handleChange}
            name="vendorName"
            InputProps={{
              readOnly: !isEditMode,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Vendor Number"
            value={vendorDetails.vendorNumber}
            onChange={handleChange}
            name="vendorNumber"
            InputProps={{
              readOnly: !isEditMode,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            value={vendorDetails.email}
            onChange={handleChange}
            name="email"
            InputProps={{
              readOnly: !isEditMode,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone"
            value={vendorDetails.phone}
            onChange={handleChange}
            name="phone"
            InputProps={{
              readOnly: !isEditMode,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Street Address"
            value={vendorDetails.streetAddress}
            onChange={handleChange}
            name="streetAddress"
            InputProps={{
              readOnly: !isEditMode,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="City"
            value={vendorDetails.city}
            onChange={handleChange}
            name="city"
            InputProps={{
              readOnly: !isEditMode,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="State"
            value={vendorDetails.state}
            onChange={handleChange}
            name="state"
            InputProps={{
              readOnly: !isEditMode,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Zip Code"
            value={vendorDetails.zipCode}
            onChange={handleChange}
            name="zipCode"
            InputProps={{
              readOnly: !isEditMode,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Country"
            value={vendorDetails.country}
            onChange={handleChange}
            name="country"
            InputProps={{
              readOnly: !isEditMode,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Quality Representative Name"
            value={vendorDetails.qualityRepName}
            onChange={handleChange}
            name="qualityRepName"
            InputProps={{
              readOnly: !isEditMode,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Sales Representative Name"
            value={vendorDetails.salesRepName}
            onChange={handleChange}
            name="salesRepName"
            InputProps={{
              readOnly: !isEditMode,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Certification Details
          </Typography>
        </Grid>
        {certifications.map((cert, index) => (
          <React.Fragment key={index}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Certificate Name"
                value={cert.certificateName}
                onChange={(e) => handleCertificationChange(index, "certificateName", e.target.value)}
                InputProps={{
                  readOnly: !isEditMode,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Certificate Text"
                multiline
                rows={3}
                value={cert.certificateText}
                onChange={(e) => handleCertificationChange(index, "certificateText", e.target.value)}
                InputProps={{
                  readOnly: !isEditMode,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Issued Date"
                type="date"
                value={cert.issuedDate}
                onChange={(e) => handleCertificationChange(index, "issuedDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  readOnly: !isEditMode,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Issued By"
                value={cert.issuedBy}
                onChange={(e) => handleCertificationChange(index, "issuedBy", e.target.value)}
                InputProps={{
                  readOnly: !isEditMode,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Expiration Date"
                type="date"
                value={cert.expirationDate}
                onChange={(e) => handleCertificationChange(index, "expirationDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  readOnly: !isEditMode,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={cert.notes}
                onChange={(e) => handleCertificationChange(index, "notes", e.target.value)}
                InputProps={{
                  readOnly: !isEditMode,
                }}
              />
            </Grid>
            {isEditMode && (
              <Grid item xs={12}>
                <IconButton onClick={() => removeCertification(index)}>
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Grid>
            )}
          </React.Fragment>
        ))}
        {isEditMode && (
          <Grid item xs={12}>
            <Button onClick={addCertification} color="primary">
              <AddCircleOutlineIcon /> Add Certification
            </Button>
          </Grid>
        )}
        {isEditMode && (
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </Grid>
        )}
      </Grid>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          iconMapping={{
            success: <CheckCircleOutlineIcon fontSize="inherit" />,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default VendorDetailsForm;
