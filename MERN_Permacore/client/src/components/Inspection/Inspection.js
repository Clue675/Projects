import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from 'react-to-print';
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import InspectionReportPDF from '../Inspection/InspectionReportPDF';

const initialNewInspectionState = {
  inspectorFirstName: "",
  inspectorLastName: "",
  inspectorBadgeNumber: "",
  partNumber: "",
  orderNumber: "",
  vendorName: "",
  vendorId: "",
  workOrderNumber: "",
  reworkNumber: "",
  purchaseOrderNumber: "",
  inspectionDetails: "",
  quantityRejected: "",
  rejectionCode: "",
  atFault: "",
  discrepancyDetails: "",
  notes: "",
  shipmentId: "",
  quantityReceived: 0,
  quantityAccepted: 0,
  rejectionCodes: [],
};

const InspectionPage = () => {
  const [openOrders, setOpenOrders] = useState([]);
  const [createInspectionDialogOpen, setCreateInspectionDialogOpen] = useState(false);
  const [newInspection, setNewInspection] = useState(initialNewInspectionState);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCodes, setFilteredCodes] = useState([]);
  const printRef = useRef();

  useEffect(() => {
    fetchOpenOrders();
    fetchRejectionCodes();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewInspection((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRejectionCodeChange = (event) => {
    const { value } = event.target;
    setNewInspection((prevState) => ({
      ...prevState,
      rejectionCodes: [value],
    }));
  };

  const fetchOpenOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/shipments/openShipments");
      if (response.data) {
        const mappedOrders = response.data.map((order) => ({
          ...order,
          id: order._id,
          receivedDate: new Date(order.dateReceived).toLocaleDateString(),
          orderNumber: order.purchaseOrderNumber
            ? order.purchaseOrderNumber.toString()
            : "N/A",
          partNumber: order.partNumber || "N/A",
          workOrderNumber: order.workOrderNumber
            ? order.workOrderNumber.toString()
            : "N/A",
          reworkNumber: order.reworkNumber
            ? order.reworkNumber.toString()
            : "N/A",
          quantityReceived: order.quantityShipped
            ? order.quantityShipped.toString()
            : "0",
          notes: order.notes || "N/A",
        }));
        setOpenOrders(mappedOrders);
      } else {
        console.error("No data returned from the server");
        setSnackbarMessage("No data returned from the server");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error fetching open orders:", error);
      setSnackbarMessage("Error fetching open orders");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchRejectionCodes = async () => {
    try {
      const response = await axios.get("/api/rejectionCodes");
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error(
          "Received non-array or unexpected response for rejection codes"
        );
        setSnackbarMessage("Failed to load rejection codes");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error fetching rejection codes:", error);
      setSnackbarMessage("Network error: Could not fetch rejection codes");
      setSnackbarOpen(true);
    }
  };

  const handleCreateInspection = async () => {
    setLoading(true);

    try {
      const processedData = preProcessInspectionData(newInspection, openOrders);
      if (!processedData.success) {
        setSnackbarMessage(processedData.message);
        setSnackbarOpen(true);
        return;
      }

      if (
        processedData.data.rejectionCodes &&
        Array.isArray(processedData.data.rejectionCodes)
      ) {
        processedData.data.rejectionCodes =
          processedData.data.rejectionCodes.map((code) => code.toString());
      } else {
        processedData.data.rejectionCodes = [];
      }

      console.log(
        "Processed data before sending to server:",
        processedData.data
      );

      await axios.post("/api/inspections", processedData.data);

      await fetchOpenOrders();

      setSnackbarMessage("Inspection created successfully.");
      setNewInspection(initialNewInspectionState);
    } catch (error) {
      console.error("Error creating inspection:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create inspection. Please try again.";
      setSnackbarMessage(errorMessage);
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  function preProcessInspectionData(inspectionData, openOrders) {
    console.log("Raw inspection data before processing:", inspectionData);

    const selectedOrder = openOrders.find(
      (order) => order.orderNumber === inspectionData.orderNumber
    );

    if (!selectedOrder) {
      console.error(
        "No matching order found for orderNumber:",
        inspectionData.orderNumber
      );
      return {
        success: false,
        message: "Matching order not found.",
        data: inspectionData,
      };
    }

    console.log("Selected order details for enrichment:", selectedOrder);

    if (!selectedOrder._id) {
      console.error("Critical field missing in selectedOrder: shipmentId");
      return {
        success: false,
        message: "Critical field missing: shipmentId",
        data: inspectionData,
      };
    }

    const processedData = {
      ...inspectionData,
      shipmentId: inspectionData.shipmentId || selectedOrder._id,
      vendorId: inspectionData.vendorId || selectedOrder.vendorId,
      purchaseOrderNumber:
        inspectionData.purchaseOrderNumber || selectedOrder.purchaseOrderNumber,
      vendorName: inspectionData.vendorName || selectedOrder.vendorName,
      partNumber: inspectionData.partNumber || selectedOrder.partNumber,
      
    };

    console.log("Processed data before sending to server:", processedData);

    processedData.quantityAccepted =
      processedData.quantityReceived - processedData.quantityRejected;

    ["vendorName", "inspectionNotes", "notes", "partNumber"].forEach(
      (field) => {
        if (typeof processedData[field] === "string") {
          processedData[field] = processedData[field].trim();
        }
      }
    );

    const requiredFields = [
      "shipmentId",
      "vendorId",
      "purchaseOrderNumber",
      "vendorName",
      "quantityReceived",
      "partNumber",
    ];
    const missingFields = requiredFields.filter(
      (field) => !processedData[field] && processedData[field] !== 0
    );

    if (missingFields.length > 0) {
      console.error(
        "Pre-processing error: Missing required fields - ",
        missingFields.join(", ")
      );
      return {
        success: false,
        message: "Missing required fields: " + missingFields.join(", "),
        data: processedData,
      };
    }

    console.log("Processed inspection data after processing:", processedData);
    return {
      success: true,
      message: "Data processed successfully.",
      data: processedData,
    };
  }

  const handleOrderSelection = (event) => {
    const orderNumber = event.target.value;
    const selectedOrder = openOrders.find(
      (order) => order.orderNumber === orderNumber
    );

    if (selectedOrder) {
      if (!selectedOrder._id || !selectedOrder.vendorId) {
        console.error(
          "Critical data missing in selected order:",
          selectedOrder
        );
        setSnackbarMessage(
          "Error: Critical data missing in the selected order. Please check data integrity."
        );
        setSnackbarOpen(true);
        return;
      }

      setNewInspection((prevState) => ({
        ...prevState,
        orderNumber: selectedOrder.orderNumber,
        vendorId: selectedOrder.vendorId,
        vendorName: selectedOrder.vendorName,
        shipmentId: selectedOrder._id,
        quantityReceived: selectedOrder.quantityShipped.toString(),
        partNumber: selectedOrder.partNumber,
      }));

      setSnackbarMessage(
        `Order ${selectedOrder.orderNumber} selected. Please review and adjust details as needed.`
      );
      setSnackbarOpen(true);
    } else {
      console.error(
        "Selected order not found or is invalid for order number:",
        orderNumber
      );
      setSnackbarMessage(
        "Error: Selected order not found or is invalid. Please select a valid order."
      );
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleQuantityRejectedChange = (event) => {
    const { value } = event.target;
    const rejectedQuantity = parseInt(value, 10) || 0;

    setNewInspection((prevState) => {
      const quantityAccepted = Math.max(
        prevState.quantityReceived - rejectedQuantity,
        0
      );

      return {
        ...prevState,
        quantityRejected: rejectedQuantity,
        quantityAccepted,
      };
    });
  };

  const columns = [
    { field: "orderNumber", headerName: "Order Number", width: 150 },
    { field: "vendorName", headerName: "Vendor Name", width: 180 },
    { field: "partNumber", headerName: "Part Number", width: 130 },
    {
      field: "quantityReceived",
      headerName: "Quantity Received",
      type: "number",
      width: 150,
    },
    {
      field: "quantityAccepted",
      headerName: "Quantity Accepted",
      type: "number",
      width: 150,
    },
    {
      field: "quantityRejected",
      headerName: "Quantity Rejected",
      type: "number",
      width: 150,
    },
    { field: "rejectionCodes", headerName: "Rejection Codes", width: 150 },
    { field: "atFault", headerName: "At Fault", width: 120 },
    {
      field: "inspectionDate",
      headerName: "Inspection Date",
      width: 160,
      type: "date",
      valueGetter: (params) =>
        params.row.inspectionDate
          ? new Date(params.row.inspectionDate).toLocaleDateString()
          : "",
    },
    { field: "notes", headerName: "Notes", width: 200, sortable: false },
    {
      field: "inspectorFirstName",
      headerName: "Inspector First Name",
      width: 150,
    },
    {
      field: "inspectorLastName",
      headerName: "Inspector Last Name",
      width: 150,
    },
    {
      field: "inspectorBadgeNumber",
      headerName: "Inspector Badge Number",
      width: 150,
    },
  ];

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inspection Management
      </Typography>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        color="primary"
        onClick={() => setCreateInspectionDialogOpen(true)}
      >
        Add Inspection
      </Button>
      <Button
        startIcon={<PrintIcon />}
        variant="outlined"
        color="secondary"
        onClick={() => {
          // eslint-disable-next-line no-undef
          setPrintView(true);
          handlePrint();
        }}
        sx={{ ml: 2 }}
      >
        Print Inspection Report
      </Button>

      <Dialog
        open={createInspectionDialogOpen}
        onClose={() => setCreateInspectionDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Add New Inspection</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="open-order-select-label">
                  Select Open Order
                </InputLabel>
                <Select
                  labelId="open-order-select-label"
                  value={newInspection.orderNumber}
                  onChange={handleOrderSelection}
                  name="orderNumber"
                >
                  {openOrders.map((order) => (
                    <MenuItem key={order.id} value={order.orderNumber}>
                      {order.orderNumber} - {order.vendorName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity Received"
                type="number"
                name="quantityReceived"
                value={newInspection.quantityReceived}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity Accepted"
                type="number"
                name="quantityAccepted"
                value={
                  newInspection.quantityAccepted
                    ? newInspection.quantityAccepted.toString()
                    : "0"
                }
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Quantity Rejected"
                type="number"
                name="quantityRejected"
                value={newInspection.quantityRejected}
                onChange={handleInputChange}
                onBlur={handleQuantityRejectedChange}
                helperText="Required if rejection is identified"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category-select"
                  value={selectedCategory}
                  label="Category"
                  onChange={(event) => {
                    setSelectedCategory(event.target.value);
                    const category = categories.find(
                      (cat) => cat.category === event.target.value
                    );
                    setFilteredCodes(category ? category.codes : []);
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.category} value={cat.category}>
                      {cat.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="rejection-code-label">
                  Rejection Code
                </InputLabel>
                <Select
                  labelId="rejection-code-label"
                  id="rejection-code-select"
                  value={newInspection.rejectionCodes[0] || ""}
                  label="Rejection Code"
                  onChange={handleRejectionCodeChange}
                  name="rejectionCode"
                >
                  {filteredCodes.map((code) => (
                    <MenuItem key={code.codeId} value={code.codeId}>
                      {`${code.codeNumber} - ${code.description}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fault"
                type="text"
                name="atFault"
                value={newInspection.atFault}
                onChange={handleInputChange}
                select
              >
                <MenuItem value="Vendor">Vendor</MenuItem>
                <MenuItem value="Internal">Internal</MenuItem>
                <MenuItem value="Customer Return">Customer Return</MenuItem>
                <MenuItem value="N/A">N/A</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="IS"
                type="text"
                name="isDescription"
                value={newInspection.isDescription || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Should Be"
                type="text"
                name="shouldBeDescription"
                value={newInspection.shouldBeDescription || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                type="text"
                multiline
                rows={3}
                name="notes"
                value={newInspection.notes}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Inspector First Name"
                type="text"
                name="inspectorFirstName"
                value={newInspection.inspectorFirstName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Inspector Last Name"
                type="text"
                name="inspectorLastName"
                value={newInspection.inspectorLastName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Inspector Badge Number"
                type="text"
                name="inspectorBadgeNumber"
                value={newInspection.inspectorBadgeNumber}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setCreateInspectionDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateInspection} variant="contained" disabled={loading}>
            {loading ? 'Processing...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Open Orders
      </Typography>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={openOrders}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
          onRowClick={(params) => {
            const selectedOrder = openOrders.find(
              (order) => order.id === params.id
            );
            setNewInspection((prev) => ({
              ...prev,
              orderNumber: selectedOrder.orderNumber || "",
              vendorName: selectedOrder.vendorName || "",
              workOrderNumber: selectedOrder.workOrderNumber || "",
              reworkNumber: selectedOrder.reworkNumber || "",
              quantityReceived: selectedOrder.quantityReceived.toString(),
              notes: selectedOrder.notes || "No additional notes",
              quantityRejected: "0",
              discrepancyDetails: "",
              atFault: "N/A",
            }));
            setCreateInspectionDialogOpen(true);
          }}
        />
      </div>
      <div style={{ display: 'none' }}>
        <InspectionReportPDF ref={printRef} data={newInspection} />
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <Button
            color="secondary"
            size="small"
            onClick={() => setSnackbarOpen(false)}
          >
            CLOSE
          </Button>
        }
      />
    </Container>
  );
};

export default InspectionPage;
