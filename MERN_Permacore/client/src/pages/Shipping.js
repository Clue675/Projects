import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Button,
  TextField,
  Paper,
  Snackbar,
  Stack,
  Grid,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import SearchVendorBox from "../components/Shipping/SearchVendBox"; // Adjust the path as needed
import ShipmentChart from "../components/Shipping/ShipmentChart";

const ShipmentPage = () => {
  // State variables
  const [shipments, setShipments] = useState([]);
  const [newShipment, setNewShipment] = useState({});
  const [isVendorBoxOpen, setIsVendorBoxOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid =
    newShipment.vendorId &&
    newShipment.purchaseOrderNumber &&
    newShipment.partNumber &&
    newShipment.quantityShipped &&
    newShipment.unitCost &&
    newShipment.dateReceived &&
    newShipment.expectedDeliveryDate;

  // Fetch existing shipments
  useEffect(() => {
    const fetchShipments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/shipments");
        setShipments(response.data.map((d) => ({ ...d, id: d._id })));
      } catch (error) {
        console.error("Error fetching shipments:", error);
        setSnackbarMessage("Error fetching shipments");
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, []);

  const handleAddShipment = async () => {
    if (!isFormValid) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarOpen(true);
      return;
    }

    try {
      const shipmentData = {
        ...newShipment,
        quantityShipped: parseInt(newShipment.quantityShipped, 10),
        unitCost: parseFloat(newShipment.unitCost),
        vendorName: newShipment.vendorName
      };

      const response = await axios.post("/api/shipments", shipmentData);

      if (response.status === 201) {
        console.log("Shipment added successfully", response.data);
        setShipments([
          ...shipments,
          { ...response.data, id: response.data._id },
        ]);
        setSnackbarMessage("Shipment added successfully");
        setNewShipment({});
      } else {
        throw new Error("Failed to add shipment");
      }
    } catch (error) {
      console.error("Error adding shipment:", error);
      const errorMessage = error.response?.data?.message || "Error adding shipment. Please try again.";
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  // Close Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSelectVendor = (vendor) => {
    setNewShipment({
      ...newShipment,
      vendorName: vendor.vendorName,
      vendorNumber: vendor.vendorNumber,
      vendorId: vendor.vendorId,
    });
    setIsVendorBoxOpen(false);
  };

  // Columns for DataGrid
  const columns = [
    { field: "vendorNumber", headerName: "Vendor ID", width: 150, type: "number" },
    { field: "vendorName", headerName: "Vendor Name", width: 250 },
    { field: "purchaseOrderNumber", headerName: "PO Number", width: 130, type: "number" },
    { field: "partNumber", headerName: "Part Number", width: 150, type: "string" },
    { field: "workOrderNumber", headerName: "Work Order Number", width: 150, type: "string" },
    { field: "reworkNumber", headerName: "Rework Number", width: 150, type: "string" },
    {
      field: "dateReceived",
      headerName: "Date Received",
      width: 150,
      type: "date",
      valueGetter: (params) => (params.value ? new Date(params.value) : null),
    },
    { field: "quantityShipped", headerName: "Quantity Shipped", width: 130, type: "number" },
    { field: "unitCost", headerName: "Unit Cost", width: 130, type: "number" },
    {
      field: "expectedDeliveryDate",
      headerName: "Expected Delivery",
      width: 150,
      type: "date",
      valueGetter: ({ value }) => (value ? new Date(value) : null),
    },
    { field: "notes", headerName: "Notes", width: 200 },
  ];

  // Custom Toolbar for DataGrid
  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarExport csvOptions={{ allColumns: true, fileName: "shipments_export.csv" }} />
    </GridToolbarContainer>
  );

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Shipment Management
      </Typography>

      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Vendor Name"
              value={newShipment.vendorName || ""}
              onChange={(e) => setNewShipment({ ...newShipment, vendorName: e.target.value })}
              onClick={() => setIsVendorBoxOpen(true)}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="number"
              label="Purchase Order Number"
              onChange={(e) => setNewShipment({ ...newShipment, purchaseOrderNumber: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Part Number"
              onChange={(e) => setNewShipment({ ...newShipment, partNumber: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Work Order Number"
              onChange={(e) => setNewShipment({ ...newShipment, workOrderNumber: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Rework Number"
              onChange={(e) => setNewShipment({ ...newShipment, reworkNumber: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="date"
              label="Date Received"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setNewShipment({ ...newShipment, dateReceived: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="number"
              label="Quantity Shipped"
              onChange={(e) => setNewShipment({ ...newShipment, quantityShipped: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="number"
              label="Unit Cost"
              onChange={(e) => setNewShipment({ ...newShipment, unitCost: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="date"
              label="Expected Delivery Date"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setNewShipment({ ...newShipment, expectedDeliveryDate: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notes"
              multiline
              rows={4}
              onChange={(e) => setNewShipment({ ...newShipment, notes: e.target.value })}
              fullWidth
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>

      <Button
        onClick={handleAddShipment}
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        disabled={!isFormValid}
      >
        Add Shipment
      </Button>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <div style={{ height: 400, width: "100%", marginBottom: "20px" }}>
          <DataGrid
            rows={shipments}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            components={{ Toolbar: CustomToolbar }}
          />
        </div>
      )}

      <SearchVendorBox
        open={isVendorBoxOpen}
        onClose={() => setIsVendorBoxOpen(false)}
        onSelect={handleSelectVendor}
      />

      <Stack direction="row" sx={{ width: "100%", marginBottom: "20px" }}>
        <ShipmentChart />
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default ShipmentPage;
