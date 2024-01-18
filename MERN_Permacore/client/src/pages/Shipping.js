import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

const ShipmentPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddingShipment, setIsAddingShipment] = useState(false);
  const [newShipment, setNewShipment] = useState({});
  const [error, setError] = useState("");
  const [editShipmentDialogOpen, setEditShipmentDialogOpen] = useState(false);
  const [editShipmentData, setEditShipmentData] = useState({});

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/shipments");
      const shipmentsWithId = response.data.map((item) => ({
        ...item,
        id: item._id,
      }));
      setShipments(shipmentsWithId);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      setError("Failed to load shipments.");
    }
    setLoading(false);
  };

  const handleAddShipment = async () => {
    if (
      !newShipment.shipmentId ||
      !newShipment.purchaseOrderNumber ||
      !newShipment.partNumber
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/shipments", newShipment);
      fetchShipments();
      setIsAddingShipment(false);
      setNewShipment({});
    } catch (error) {
      console.error("Error adding new shipment:", error);
      setError("Failed to add new shipment.");
    }
    setLoading(false);
  };

  const handleEditShipment = async () => {
    if (
      !editShipmentData.shipmentId ||
      !editShipmentData.purchaseOrderNumber ||
      !editShipmentData.partNumber
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await axios.put(
        `/api/shipments/${editShipmentData.id}`,
        editShipmentData
      );
      fetchShipments();
      setEditShipmentDialogOpen(false);
      setEditShipmentData({});
    } catch (error) {
      console.error("Error updating shipment:", error);
      setError("Failed to update shipment.");
    }
    setLoading(false);
  };

  const openEditDialog = (row) => {
    setEditShipmentData(row);
    setEditShipmentDialogOpen(true);
  };

  const columns = [
    { field: "shipmentId", headerName: "Shipment ID", width: 150 },
    { field: "purchaseOrderNumber", headerName: "PO Number", width: 130 },
    { field: "partNumber", headerName: "Part Number", width: 130 },
    {
      field: "quantityShipped",
      headerName: "Quantity Shipped",
      width: 130,
      type: "number",
    },
    { field: "unitCost", headerName: "Unit Cost", width: 130, type: "number" },
    {
      field: "dateReceived",
      headerName: "Date Received",
      width: 180,
      type: "date",
      valueGetter: (params) =>
        params.row.dateReceived ? new Date(params.row.dateReceived) : null,
    },
    {
      field: "expectedDeliveryDate",
      headerName: "Expected Delivery",
      width: 180,
      type: "date",
      valueGetter: (params) =>
        params.row.expectedDeliveryDate
          ? new Date(params.row.expectedDeliveryDate)
          : null,
    },
    { field: "notes", headerName: "Notes", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => openEditDialog(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4">Shipment Management</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Button startIcon={<AddIcon />} onClick={() => setIsAddingShipment(true)}>
        Add Shipment
      </Button>
      <div style={{ height: 600, width: "100%", marginTop: 20 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <DataGrid
            rows={shipments}
            columns={columns}
            pageSize={10}
            components={{ Toolbar: GridToolbar }}
          />
        )}
      </div>

      {/* Add Shipment Dialog */}
      <Dialog
        open={isAddingShipment}
        onClose={() => setIsAddingShipment(false)}
      >
        <DialogTitle>Add New Shipment</DialogTitle>
        <DialogContent>
          {/* Add input fields for new shipment details */}
          <TextField
            label="Shipment ID"
            fullWidth
            onChange={(e) =>
              setNewShipment({ ...newShipment, shipmentId: e.target.value })
            }
          />
          <TextField
            label="PO Number"
            fullWidth
            onChange={(e) =>
              setNewShipment({
                ...newShipment,
                purchaseOrderNumber: e.target.value,
              })
            }
          />
          <TextField
            label="Part Number"
            fullWidth
            onChange={(e) =>
              setNewShipment({ ...newShipment, partNumber: e.target.value })
            }
          />
          <TextField
            label="Quantity Shipped"
            type="number"
            fullWidth
            onChange={(e) =>
              setNewShipment({
                ...newShipment,
                quantityShipped: e.target.value,
              })
            }
          />
          <TextField
            label="Unit Cost"
            type="number"
            fullWidth
            onChange={(e) =>
              setNewShipment({ ...newShipment, unitCost: e.target.value })
            }
          />
          <TextField
            label="Date Received"
            type="date"
            fullWidth
            onChange={(e) =>
              setNewShipment({ ...newShipment, dateReceived: e.target.value })
            }
          />
          <TextField
            label="Expected Delivery"
            type="date"
            fullWidth
            onChange={(e) =>
              setNewShipment({
                ...newShipment,
                expectedDeliveryDate: e.target.value,
              })
            }
          />
          <TextField
            label="Notes"
            multiline
            fullWidth
            onChange={(e) =>
              setNewShipment({ ...newShipment, notes: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddingShipment(false)}>Cancel</Button>
          <Button onClick={handleAddShipment}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Shipment Dialog */}
      <Dialog
        open={editShipmentDialogOpen}
        onClose={() => setEditShipmentDialogOpen(false)}
      >
        <DialogTitle>Edit Shipment</DialogTitle>
        <DialogContent>
          {/* Add input fields for editing shipment details */}
          <TextField
            label="Shipment ID"
            fullWidth
            value={editShipmentData.shipmentId}
            onChange={(e) =>
              setEditShipmentData({
                ...editShipmentData,
                shipmentId: e.target.value,
              })
            }
          />
          <TextField
            label="PO Number"
            fullWidth
            value={editShipmentData.purchaseOrderNumber}
            onChange={(e) =>
              setEditShipmentData({
                ...editShipmentData,
                purchaseOrderNumber: e.target.value,
              })
            }
          />
          <TextField
            label="Part Number"
            fullWidth
            value={editShipmentData.partNumber}
            onChange={(e) =>
              setEditShipmentData({
                ...editShipmentData,
                partNumber: e.target.value,
              })
            }
          />
          <TextField
            label="Quantity Shipped"
            type="number"
            fullWidth
            value={editShipmentData.quantityShipped}
            onChange={(e) =>
              setEditShipmentData({
                ...editShipmentData,
                quantityShipped: e.target.value,
              })
            }
          />
          <TextField
            label="Unit Cost"
            type="number"
            fullWidth
            value={editShipmentData.unitCost}
            onChange={(e) =>
              setEditShipmentData({
                ...editShipmentData,
                unitCost: e.target.value,
              })
            }
          />
          <TextField
            label="Date Received"
            type="date"
            fullWidth
            value={editShipmentData.dateReceived}
            onChange={(e) =>
              setEditShipmentData({
                ...editShipmentData,
                dateReceived: e.target.value,
              })
            }
          />
          <TextField
            label="Expected Delivery"
            type="date"
            fullWidth
            value={editShipmentData.expectedDeliveryDate}
            onChange={(e) =>
              setEditShipmentData({
                ...editShipmentData,
                expectedDeliveryDate: e.target.value,
              })
            }
          />
          <TextField
            label="Notes"
            multiline
            fullWidth
            value={editShipmentData.notes}
            onChange={(e) =>
              setEditShipmentData({
                ...editShipmentData,
                notes: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditShipmentDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleEditShipment}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ShipmentPage;
