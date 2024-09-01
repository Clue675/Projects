import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";

const CertificationUpload = ({ vendorId, onUploadSuccess }) => {
  const [certificateName, setCertificateName] = useState("");
  const [issuedBy, setIssuedBy] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [notes, setNotes] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleAddCertification = async (vendorId, formData) => {
    try {
      const response = await axios.post(`/api/vendors/${vendorId}/certifications`, formData);
      setSnackbarMessage("Certification added successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      onUploadSuccess();
    } catch (error) {
      setSnackbarMessage("Error adding certification.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCertificationUpload = async () => {
    if (!certificateName || !issuedBy || !issuedDate || !expirationDate) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const formData = {
      certificateName,
      issuedBy,
      issuedDate: new Date(issuedDate).toISOString(),
      expirationDate: new Date(expirationDate).toISOString(),
      notes
    };

    await handleAddCertification(vendorId, formData);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Add Certification
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Certificate Name"
            value={certificateName}
            onChange={(e) => setCertificateName(e.target.value)}
            required
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Issued By"
            value={issuedBy}
            onChange={(e) => setIssuedBy(e.target.value)}
            required
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Issued Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={issuedDate}
            onChange={(e) => setIssuedDate(e.target.value)}
            required
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Expiration Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleCertificationUpload}>
            Add Certification
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CertificationUpload;
