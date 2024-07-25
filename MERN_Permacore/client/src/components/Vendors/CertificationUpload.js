import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

const CertificationUpload = ({ vendorId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [certificateName, setCertificateName] = useState("");
  const [issuedBy, setIssuedBy] = useState("");
  const [issuedDate, setIssuedDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleAddCertification = async (vendorId, formData) => {
    try {
      const response = await axios.post(`/api/vendors/${vendorId}/certifications`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(`Certification added: ${response.data.certifications}`);
      setSnackbarMessage("Certification added successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error adding certification: ", error);
      setSnackbarMessage("Error adding certification.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCertificationUpload = async () => {
    if (!selectedFile || !certificateName || !issuedBy || !issuedDate || !expirationDate || !fileName) {
      setSnackbarMessage("Please fill in all required fields and select a file.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const formData = new FormData();
    formData.append("certificationFile", selectedFile);
    formData.append("certificateName", certificateName);
    formData.append("issuedBy", issuedBy);
    formData.append("issuedDate", issuedDate);
    formData.append("expirationDate", expirationDate);
    formData.append("notes", notes);
    formData.append("fileName", fileName);

    await handleAddCertification(vendorId, formData);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Upload Certification
      </Typography>
      <form>
        <TextField
          fullWidth
          label="Certificate Name"
          value={certificateName}
          onChange={(e) => setCertificateName(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Issued By"
          value={issuedBy}
          onChange={(e) => setIssuedBy(e.target.value)}
          required
          margin="normal"
        />
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
        <TextField
          fullWidth
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="File Name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          required
          margin="normal"
        />
        <input type="file" onChange={handleFileChange} required />
        <Button variant="contained" color="primary" onClick={handleCertificationUpload}>
          Upload Certification
        </Button>
      </form>
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
