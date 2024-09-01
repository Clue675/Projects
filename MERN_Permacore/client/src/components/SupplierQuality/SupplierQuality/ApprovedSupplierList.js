import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Snackbar,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Switch,
  FormControlLabel,
  DialogContentText,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const ApprovedSupplierList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedVendorDetails, setSelectedVendorDetails] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [notifyDate, setNotifyDate] = useState("");

  const getCurrentQuarterDates = useCallback(() => {
    const today = new Date();
    const quarter = Math.floor(today.getMonth() / 3);
    const firstDate = new Date(today.getFullYear(), quarter * 3, 1);
    const endDate = new Date(
      firstDate.getFullYear(),
      firstDate.getMonth() + 3,
      0
    );
    return { startDate: firstDate, endDate: endDate };
  }, []);

  const fetchVendors = useCallback(async () => {
    const { startDate, endDate } = getCurrentQuarterDates();
    setLoading(true);
    try {
      const response = await axios.get("/api/vendors");
      if (response.data.length === 0) {
        setSnackbarMessage("No vendors found.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setLoading(false);
        return;
      }

      const vendorData = await Promise.all(
        response.data.map(async (vendor) => {
          try {
            const { data: performanceData } = await axios.get(
              `/api/vendorPerformance/${vendor._id}/byDate`,
              {
                params: {
                  startDate: startDate.toISOString(),
                  endDate: endDate.toISOString(),
                },
              }
            );

            if (!performanceData || performanceData.length === 0) {
              return {
                ...vendor,
                qualityScore: "No data",
                OTDScore: "No data",
                performanceScore: "No data",
              };
            }

            const latestPerformance = performanceData[0];
            return {
              ...vendor,
              qualityScore: latestPerformance.qualityRating || "No data",
              OTDScore: latestPerformance.deliveryRating || "No data",
              performanceScore: latestPerformance.overallRating || "No data",
            };
          } catch (perfError) {
            return {
              ...vendor,
              qualityScore: "Error",
              OTDScore: "Error",
              performanceScore: "Error",
            };
          }
        })
      );

      setVendors(vendorData);
    } catch (error) {
      setSnackbarMessage("Failed to fetch vendors. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  }, [getCurrentQuarterDates]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedVendorDetails(null);
  };

  const handleCertificationClick = async (vendorId) => {
    setSelectedVendor(vendorId);
    try {
      const response = await axios.get(`/api/vendors/${vendorId}`);
      setSelectedVendorDetails(response.data);
      setOpenDialog(true);
    } catch (error) {
      setSnackbarMessage("Failed to fetch vendor details.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCertificationUploadSuccess = () => {
    setSnackbarMessage("Certifications added successfully");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
    setOpenDialog(false);
    fetchVendors();
  };

  const getColor = (score) => {
    if (score === "No data" || score === "Error") return "black";
    const numScore = parseFloat(score);
    if (isNaN(numScore)) return "black";
    if (numScore >= 98) return "green";
    if (numScore >= 95) return "yellow";
    return "red";
  };

  const handleStatusDoubleClick = async (vendor) => {
    setSelectedVendor(vendor);
    setNewStatus(vendor.status);
    setStatusDialogOpen(true);
  };

  const handleStatusChange = async () => {
    try {
      const statusPayload = {
        status: newStatus,
      };
      if (["Inactive", "Disqualified", "On-Hold"].includes(newStatus)) {
        statusPayload.notifyDate = notifyDate;
      }

      await axios.put(`/api/vendors/${selectedVendor._id}`, statusPayload);
      setSnackbarMessage(`Vendor status updated to ${newStatus}`);
      setSnackbarSeverity("success");
      fetchVendors();
    } catch (error) {
      setSnackbarMessage("Failed to update vendor status.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setStatusDialogOpen(false);
    }
  };

  const handleVendorNameDoubleClick = async (vendorId) => {
    setSelectedVendor(vendorId);
    try {
      const response = await axios.get(`/api/vendors/${vendorId}`);
      setSelectedVendorDetails(response.data);
      setIsEditMode(false);
      setOpenDialog(true);
    } catch (error) {
      setSnackbarMessage("Failed to fetch vendor details.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleDateDoubleClick = async (vendor, dateType) => {
    const newDate = prompt(`Enter new ${dateType.replace(/([A-Z])/g, ' $1').toLowerCase()}:`, formatDate(vendor[dateType]));
    if (newDate) {
      try {
        await axios.put(`/api/vendors/${vendor._id}`, { [dateType]: new Date(newDate).toISOString() });
        setSnackbarMessage(`Vendor ${dateType.replace(/([A-Z])/g, ' $1').toLowerCase()} updated successfully.`);
        setSnackbarSeverity("success");
        fetchVendors();
      } catch (error) {
        setSnackbarMessage("Failed to update date.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  const columns = [
    {
      field: "vendorName",
      headerName: "Vendor Name",
      width: 200,
      renderCell: (params) => (
        <span
          onDoubleClick={() => handleVendorNameDoubleClick(params.row._id)}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          {params.value}
        </span>
      ),
    },
    { field: "vendorNumber", headerName: "Vendor Number", width: 150 },
    {
      field: "qualityScore",
      headerName: "Quality Score",
      width: 130,
      renderCell: (params) => {
        const value = parseFloat(params.value);
        const displayValue = !isNaN(value) ? `${value.toFixed(2)}%` : params.value;
        return <span style={{ color: getColor(params.value) }}>{displayValue}</span>;
      },
    },
    {
      field: "OTDScore",
      headerName: "OTD Score",
      width: 130,
      renderCell: (params) => {
        const value = parseFloat(params.value);
        const displayValue = !isNaN(value) ? `${value.toFixed(2)}%` : params.value;
        return <span style={{ color: getColor(params.value) }}>{displayValue}</span>;
      },
    },
    {
      field: "performanceScore",
      headerName: "Performance Score",
      width: 130,
      renderCell: (params) => {
        const value = parseFloat(params.value);
        const displayValue = !isNaN(value) ? `${value.toFixed(2)}%` : params.value;
        return <span style={{ color: getColor(params.value) }}>{displayValue}</span>;
      },
    },
    {
      field: "lastAuditDate",
      headerName: "Last Audit Date",
      width: 130,
      renderCell: (params) => (
        <span
          onDoubleClick={() => handleDateDoubleClick(params.row, "lastAuditDate")}
          style={{ cursor: "pointer" }}
        >
          {formatDate(params.value)}
        </span>
      ),
    },
    {
      field: "nextAuditDate",
      headerName: "Next Audit Date",
      width: 130,
      renderCell: (params) => {
        const date = new Date(params.value);
        const today = new Date();
        const color = date < today ? "red" : date < new Date(today.setMonth(today.getMonth() + 1)) ? "yellow" : "green";
        return (
          <Tooltip title="Double click to update date">
            <span
              onDoubleClick={() => handleDateDoubleClick(params.row, "nextAuditDate")}
              style={{ cursor: "pointer", color }}
            >
              {formatDate(params.value)}
            </span>
          </Tooltip>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <span
          onDoubleClick={() => handleStatusDoubleClick(params.row)}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          {params.value}
        </span>
      ),
    },
    { field: "comments", headerName: "Comments", width: 200 },
    {
      field: "certifications",
      headerName: "Certifications",
      width: 180,
      renderCell: (params) => (
        <Button
          onClick={() => handleCertificationClick(params.id)}
          color="primary"
        >
          View/Add Certifications
        </Button>
      ),
    },
  ];

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Approved Suppliers List
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div style={{ height: 650, width: "100%" }}>
            <DataGrid
              rows={vendors}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              disableSelectionOnClick
              components={{ Toolbar: GridToolbar }}
              loading={loading}
              getRowId={(row) => row._id}
            />
          </div>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="vendor-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="vendor-dialog-title">Vendor Details</DialogTitle>
        <DialogContent>
          {selectedVendorDetails && (
            <VendorDetailsForm
              vendorDetails={selectedVendorDetails}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              onUpdateSuccess={fetchVendors}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        aria-labelledby="status-dialog-title"
      >
        <DialogTitle id="status-dialog-title">Change Vendor Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="On-Hold">On-Hold</MenuItem>
              <MenuItem value="Probation">Probation</MenuItem>
              <MenuItem value="Disqualified">Disqualified</MenuItem>
            </Select>
          </FormControl>
          {["Inactive", "Disqualified", "On-Hold"].includes(newStatus) && (
            <>
              <DialogContentText>
                Notify Purchasing and other interested parties. Enter the date when notified.
              </DialogContentText>
              <TextField
                fullWidth
                type="date"
                value={notifyDate}
                onChange={(e) => setNotifyDate(e.target.value)}
                label="Date Notified"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleStatusChange} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const VendorDetailsForm = ({ vendorDetails, isEditMode, setIsEditMode, onUpdateSuccess }) => {
  const [vendor, setVendor] = useState(vendorDetails);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCertificationChange = (index, field, value) => {
    const updatedCertifications = [...vendor.certifications];
    updatedCertifications[index][field] = value;
    setVendor({ ...vendor, certifications: updatedCertifications });
  };

  const addCertification = () => {
    setVendor((prevVendor) => ({
      ...prevVendor,
      certifications: [
        ...prevVendor.certifications,
        {
          certificateName: "",
          issuedBy: "",
          issuedDate: "",
          expirationDate: "",
          notes: "",
          certificateText: "",
        },
      ],
    }));
  };

  const removeCertification = (index) => {
    const updatedCertifications = vendor.certifications.filter((_, i) => i !== index);
    setVendor({ ...vendor, certifications: updatedCertifications });
  };

  const handleVendorChange = (e) => {
    const { name, value } = e.target;
    setVendor((prevVendor) => ({
      ...prevVendor,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/vendors/${vendor._id}`, vendor);
      setSnackbarSeverity("success");
      setSnackbarMessage("Vendor details updated successfully");
      setOpenSnackbar(true);
      setIsEditMode(false);
      onUpdateSuccess();
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Failed to update vendor details");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Vendor Information</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isEditMode}
                onChange={() => setIsEditMode(!isEditMode)}
              />
            }
            label="Edit Mode"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Vendor Name"
            name="vendorName"
            value={vendor.vendorName}
            onChange={handleVendorChange}
            InputProps={{
              readOnly: !isEditMode,
            }}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Vendor Number"
            name="vendorNumber"
            value={vendor.vendorNumber}
            onChange={handleVendorChange}
            InputProps={{
              readOnly: !isEditMode,
            }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Contact Information</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={vendor.email}
            onChange={handleVendorChange}
            InputProps={{
              readOnly: !isEditMode,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={vendor.phone}
            onChange={handleVendorChange}
            InputProps={{
              readOnly: !isEditMode,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Street Address"
            name="streetAddress"
            value={vendor.streetAddress}
            onChange={handleVendorChange}
            InputProps={{
              readOnly: !isEditMode,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={vendor.city}
            onChange={handleVendorChange}
            InputProps={{
              readOnly: !isEditMode,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value={vendor.state}
            onChange={handleVendorChange}
            InputProps={{
              readOnly: !isEditMode,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Zip Code"
            name="zipCode"
            value={vendor.zipCode}
            onChange={handleVendorChange}
            InputProps={{
              readOnly: !isEditMode,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={vendor.country}
            onChange={handleVendorChange}
            InputProps={{
              readOnly: !isEditMode,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Certifications</Typography>
        </Grid>
        {vendor.certifications.map((cert, index) => (
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
                label="Issued Date"
                type="date"
                value={cert.issuedDate}
                onChange={(e) => handleCertificationChange(index, "issuedDate", e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
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
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  readOnly: !isEditMode,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Notes"
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
            <Button
              onClick={addCertification}
              startIcon={<AddCircleOutlineIcon />}
            >
              Add Certification
            </Button>
          </Grid>
        )}
        {isEditMode && (
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Vendor"}
            </Button>
          </Grid>
        )}
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default ApprovedSupplierList;
