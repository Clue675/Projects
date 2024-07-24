import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const ApprovedSupplier = () => {
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [vendorName, setVendorName] = useState("");

  const [vendorDetails, setVendorDetails] = useState({
    vendorName: "",
    vendorNumber: "",
    vendorCapabilities: [""],
    approvalType: "",
    lastAuditDate: "",
    nextAuditDate: "",
    status: "",
    comments: "",
    email: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
    qualityRepName: "",
    salesRepName: "",
    certificationName: "",
    certificationText: "",
    issuedDate: "",
    issuedBy: "",
    expirationDate: "",
    fileReference: "",
    certificationNotes: "",
    fileName: "",
  });

  const handleApprovalTypeChange = (event) => {
    setVendorDetails({ ...vendorDetails, approvalType: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!vendorDetails.vendorName || !vendorDetails.vendorNumber || !vendorDetails.status || !vendorDetails.email || !vendorDetails.streetAddress || !vendorDetails.city || !vendorDetails.state || !vendorDetails.zipCode || !vendorDetails.country || !vendorDetails.phone || !vendorDetails.qualityRepName || !vendorDetails.salesRepName) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Missing required fields.");
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/vendors", vendorDetails);
      if (response.status === 201) {
        setSnackbarSeverity("success");
        setSnackbarMessage(`Vendor ${vendorDetails.vendorName} added successfully!`);
        setOpenSnackbar(true);
        setVendorDetails({
          vendorName: "",
          vendorNumber: "",
          vendorCapabilities: [""],
          approvalType: "",
          lastAuditDate: "",
          nextAuditDate: "",
          status: "",
          comments: "",
          email: "",
          streetAddress: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          phone: "",
          qualityRepName: "",
          salesRepName: "",
          certificationName: "",
          certificationText: "",
          issuedDate: "",
          issuedBy: "",
          expirationDate: "",
          fileReference: "",
          certificationNotes: "",
          fileName: "",
        });
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding vendor:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Failed to add vendor: " + error.toString());
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) {
      console.log("No files selected.");
      return;
    }
    const formData = new FormData();
    formData.append("certificationFile", files[0]);
    formData.append("certificateName", vendorDetails.certificationName);
    formData.append("issuedBy", vendorDetails.issuedBy);
    formData.append("issuedDate", vendorDetails.issuedDate);
    formData.append("expirationDate", vendorDetails.expirationDate);
    formData.append("notes", vendorDetails.certificationNotes);
    formData.append("fileName", vendorDetails.fileName);

    try {
      const response = await axios.post(`/api/vendors/${vendorDetails.id}/certifications`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(`File uploaded: ${response.data.fileReference}`);
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCapabilityChange = (index, value) => {
    const newCapabilities = [...vendorDetails.vendorCapabilities];
    newCapabilities[index] = value;
    setVendorDetails({ ...vendorDetails, vendorCapabilities: newCapabilities });
  };

  const addCapability = () => {
    setVendorDetails((prevDetails) => ({
      ...prevDetails,
      vendorCapabilities: [...prevDetails.vendorCapabilities, ""],
    }));
  };

  const removeCapability = (index) => {
    const newCapabilities = [...vendorDetails.vendorCapabilities];
    newCapabilities.splice(index, 1);
    setVendorDetails({ ...vendorDetails, vendorCapabilities: newCapabilities });
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 2 }}>
      <Typography variant="h5" gutterBottom>
        Add Approved Supplier
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Vendor Name"
              value={vendorDetails.vendorName}
              onChange={handleChange}
              name="vendorName"
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Vendor Number"
              name="vendorNumber"
              value={vendorDetails.vendorNumber}
              onChange={handleChange}
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {vendorDetails.vendorCapabilities.map((capability, index) => (
              <Grid container spacing={1} key={index}>
                <Grid item xs={10}>
                  <TextField
                    fullWidth
                    label={`Vendor Capability ${index + 1}`}
                    value={capability}
                    onChange={(e) => handleCapabilityChange(index, e.target.value)}
                    name={`vendorCapability${index}`}
                    size="small"
                    required
                  />
                </Grid>
                <Grid item xs={2} style={{ display: "flex", alignItems: "center" }}>
                  {vendorDetails.vendorCapabilities.length > 1 && (
                    <IconButton onClick={() => removeCapability(index)}>
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  )}
                  {index === vendorDetails.vendorCapabilities.length - 1 && (
                    <IconButton onClick={addCapability}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Approval Type</InputLabel>
              <Select
                value={vendorDetails.approvalType}
                onChange={handleApprovalTypeChange}
                name="approvalType"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Supplier Survey">Supplier Survey</MenuItem>
                <MenuItem value="Certification">Certification</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Audit Date"
              type="date"
              value={vendorDetails.lastAuditDate}
              onChange={handleChange}
              name="lastAuditDate"
              InputLabelProps={{ shrink: true }}
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Next Audit Date"
              type="date"
              value={vendorDetails.nextAuditDate}
              onChange={handleChange}
              name="nextAuditDate"
              InputLabelProps={{ shrink: true }}
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Status</InputLabel>
              <Select
                value={vendorDetails.status}
                onChange={handleChange}
                name="status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Probation">Probation</MenuItem>
                <MenuItem value="Disqualified">Disqualified</MenuItem>
                <MenuItem value="On-Hold">On-Hold</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Comments"
              multiline
              rows={3}
              value={vendorDetails.comments}
              onChange={handleChange}
              name="comments"
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              value={vendorDetails.email}
              onChange={handleChange}
              name="email"
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Street Address"
              value={vendorDetails.streetAddress}
              onChange={handleChange}
              name="streetAddress"
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="City"
              value={vendorDetails.city}
              onChange={handleChange}
              name="city"
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="State"
              value={vendorDetails.state}
              onChange={handleChange}
              name="state"
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Zip Code"
              value={vendorDetails.zipCode}
              onChange={handleChange}
              name="zipCode"
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Country"
              value={vendorDetails.country}
              onChange={handleChange}
              name="country"
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone"
              value={vendorDetails.phone}
              onChange={handleChange}
              name="phone"
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Quality Representative Name"
              value={vendorDetails.qualityRepName}
              onChange={handleChange}
              name="qualityRepName"
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Sales Representative Name"
              value={vendorDetails.salesRepName}
              onChange={handleChange}
              name="salesRepName"
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Certification Details
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Certificate Name"
              value={vendorDetails.certificationName}
              onChange={handleChange}
              name="certificationName"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Certificate Text"
              multiline
              rows={3}
              value={vendorDetails.certificationText}
              onChange={handleChange}
              name="certificationText"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Issued Date"
              type="date"
              value={vendorDetails.issuedDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              name="issuedDate"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Issued By"
              value={vendorDetails.issuedBy}
              onChange={handleChange}
              name="issuedBy"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Expiration Date"
              type="date"
              value={vendorDetails.expirationDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              name="expirationDate"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="File Name"
              value={vendorDetails.fileName}
              onChange={handleChange}
              name="fileName"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <input
              type="file"
              onChange={(e) => handleFileUpload(e.target.files)}
              name="file"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Certification Notes"
              multiline
              rows={3}
              value={vendorDetails.certificationNotes}
              onChange={handleChange}
              name="certificationNotes"
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Vendor"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          iconMapping={{
            success: <CheckCircleOutlineIcon fontSize="inherit" />,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ApprovedSupplier;
