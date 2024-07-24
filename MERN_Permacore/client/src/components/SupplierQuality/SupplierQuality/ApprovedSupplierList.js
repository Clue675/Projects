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
  Link,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const ApprovedSupplierList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [error, setError] = useState("");

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
    setError("");
    try {
      const response = await axios.get("/api/vendors");
      console.log("Vendors fetched:", response.data);
  
      if (response.data.length === 0) {
        setError("No vendors found.");
        setVendors([]);
        setSnackbarMessage("No vendors found.");
        setOpenSnackbar(true);
        setLoading(false);
        return;
      }
  
      const vendorData = await Promise.all(
        response.data.map(async (vendor) => {
          try {
            console.log('Fetching performance for vendor:', vendor._id);
            const { data: performanceData } = await axios.get(
              `/api/vendorPerformance/${vendor._id}/byDate`,
              {
                params: {
                  startDate: startDate.toISOString(),
                  endDate: endDate.toISOString(),
                },
              }
            );
            console.log(
              "Performance Data for Vendor ID " + vendor._id + ":",
              performanceData
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
            console.error(
              "Error fetching performance data for vendor:",
              vendor._id,
              perfError
            );
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
      console.error("Error fetching vendors:", error);
      setError("Failed to fetch vendors. Please try again.");
      setSnackbarMessage("Failed to fetch vendors. Please try again.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  }, [getCurrentQuarterDates]);
  

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleCloseSnackbar = () => setOpenSnackbar(false);
  const handleDialogClose = () => setOpenDialog(false);

  const handleCertificationClick = async (vendorId) => {
    try {
      const { data } = await axios.get(
        `/api/vendors/${vendorId}/certifications`
      );
      setSelectedCertification(data);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching certification details:", error);
      setSnackbarMessage("Failed to fetch certification details");
      setOpenSnackbar(true);
    }
  };

  const getColor = (score) => {
    if (score === "No data" || score === "Error") return "black";
    const numScore = parseFloat(score);
    if (isNaN(numScore)) return "black";
    if (numScore >= 98) return "green";
    if (numScore >= 95) return "yellow";
    return "red";
  };

  const columns = [
    { field: "vendorName", headerName: "Vendor Name", width: 200 },
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
        const displayValue = !isNaN(value) ? `${value.toFixed(2)}%` : "No data";
        return <span>{displayValue}</span>;
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
    { field: "lastAuditDate", headerName: "Last Audit Date", width: 130 },
    { field: "nextAuditDate", headerName: "Next Audit Date", width: 130 },
    { field: "status", headerName: "Status", width: 120 },
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
          View Certifications
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
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="certification-dialog-title"
      >
        <DialogTitle id="certification-dialog-title">
          Certification Details
        </DialogTitle>
        <DialogContent>
          {selectedCertification ? (
            <>
              <Typography variant="body1">
                <strong>Certificate Name:</strong>{" "}
                {selectedCertification.certificateName}
              </Typography>
              <Typography variant="body1">
                <strong>Issued By:</strong> {selectedCertification.issuedBy}
              </Typography>
              <Typography variant="body1">
                <strong>Issued Date:</strong>{" "}
                {new Date(
                  selectedCertification.issuedDate
                ).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                <strong>Expiration Date:</strong>{" "}
                {selectedCertification.expirationDate
                  ? new Date(
                      selectedCertification.expirationDate
                    ).toLocaleDateString()
                  : "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Notes:</strong> {selectedCertification.notes}
              </Typography>
              {selectedCertification.fileReference && (
                <Link
                  href={`/files/${selectedCertification.fileReference}`}
                  target="_blank"
                  download
                >
                  Download Certificate
                </Link>
              )}
            </>
          ) : (
            <Typography>No Certification Details Available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ApprovedSupplierList;
