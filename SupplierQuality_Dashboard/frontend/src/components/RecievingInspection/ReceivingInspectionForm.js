import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import Select from "react-select";

const ReceivingInspectionForm = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    order_id: "",
    inspection_date: "",
    total_parts_received: "",
    total_parts_accepted: "",
    total_parts_rejected: "",
    rejection_code_id: "",
    inspector_name: "",
    comments: "",
  });

  // State for formatted rejection codes for Select component
  const [formattedCodes, setFormattedCodes] = useState([]);

  // State to manage additional order details fetched from the API
  const [orderDetails, setOrderDetails] = useState({
    vendorName: "",
    vendorNumber: "",
    orderReceivedDate: "",
    orderQuantity: "",
    partNumber: "",
    partName: "",
    revision: "",
    material: "",
    workorderNumber: "",
    promisedDate: "",
  });

  // State to manage loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch rejection codes from the API
  useEffect(() => {
    const fetchRejectionCodes = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/rejection-codes"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch rejection codes");
        }
        const codesByCategory = await response.json();
        formatRejectionCodes(codesByCategory);
      } catch (error) {
        console.error("Failed to fetch rejection codes:", error);
      }
    };

    fetchRejectionCodes();
  }, []);

  // Format rejection codes for the Select component
  const formatRejectionCodes = (codesByCategory) => {
    const formatted = Object.keys(codesByCategory).map((category) => ({
      label: category,
      options: codesByCategory[category].map((code) => ({
        value: code.id,
        label: `${code.id} - ${code.description}`,
      })),
    }));
    setFormattedCodes(formatted);
  };

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch order details from the API using enhanced search
const fetchOrderDetails = async () => {
    if (!formData.order_id && !formData.workorder_number && !formData.rework_number) {
      setError("Please enter an order ID, work order number, or rework number.");
      return;
    }
  
    setIsLoading(true);
    setError("");
  
    try {
      // Construct the query parameters dynamically based on available data
      const queryParams = new URLSearchParams();
      if (formData.order_id) queryParams.append('order_id', formData.order_id);
      if (formData.workorder_number) queryParams.append('workorder_number', formData.workorder_number);
      if (formData.rework_number) queryParams.append('rework_number', formData.rework_number);

      const response = await fetch(`http://localhost:5000/api/shipments/search`);
      if (!response.ok) {
        throw new Error("Shipment data not found for the provided criteria");
      }
  
      const data = await response.json();
      setOrderDetails({
        vendorName: data.vendor_name,
        vendorNumber: data.vendor_id,
        orderReceivedDate: data.delivered_date || "Not received yet",
        orderQuantity: data.quantity,
        partNumber: data.part_number,
        partName: data.part_name,
        revision: data.revision,
        material: data.material,
        workorderNumber: data.workorder_number,
        promisedDate: data.promised_date,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
};
  

  // Submit the form data to the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/receiving_inspection/records",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      // Handle success - reset form, clear order details, etc.
      setFormData({
        // ... reset form data fields ...
      });
      setOrderDetails({
        // ... reset order details ...
      });

      setError("");
      // Display success message or redirect as needed
    } catch (error) {
      setError("Form submission error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Render the component
  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h6">Receiving Inspection</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container alignItems="flex-start" spacing={2}>
          {/* Order ID Input */}
          <Grid item xs={12}>
            <TextField
              label="Order ID"
              name="order_id"
              value={formData.order_id}
              onChange={handleChange}
              fullWidth
              required
            />
            <Button onClick={fetchOrderDetails}>Fetch Order Details</Button>
          </Grid>

          {/* Display loading indicator and error messages */}
          {isLoading && <CircularProgress />}
          {error && <Typography color="error">{error}</Typography>}

          {/* Display fetched order details */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Order Details:</Typography>
            <Typography>
              <b>Vendor Name:</b> {orderDetails.vendorName}
            </Typography>
            <Typography>
              <b>Vendor Number:</b> {orderDetails.vendorNumber}
            </Typography>
            <Typography>
              <b>Order Received Date:</b> {orderDetails.orderReceivedDate}
            </Typography>
            <Typography>
              <b>Order Quantity:</b> {orderDetails.orderQuantity}
            </Typography>
          </Grid>

          {/* Inspection Details */}
          <Grid item xs={12}>
            <TextField
              label="Inspection Date"
              type="date"
              name="inspection_date"
              value={formData.inspection_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Total Parts Received"
              name="total_parts_received"
              value={formData.total_parts_received}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Total Parts Accepted"
              name="total_parts_accepted"
              value={formData.total_parts_accepted}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Total Parts Rejected"
              name="total_parts_rejected"
              value={formData.total_parts_rejected}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* Rejection Code Dropdown */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Rejection Code:</Typography>
            <Select
              options={formattedCodes}
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  rejection_code_id: selectedOption.value,
                })
              }
              placeholder="Select a rejection code"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Inspector Name"
              name="inspector_name"
              value={formData.inspector_name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item style={{ marginTop: 16 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Grid>

          {/* Submit Button */}
          <Grid item style={{ marginTop: 16 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ReceivingInspectionForm;
