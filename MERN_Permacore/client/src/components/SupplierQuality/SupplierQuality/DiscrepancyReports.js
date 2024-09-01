import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import InspectionReportPDF from '../Forms/Quality/DiscrepancyReports'; // Ensure this path is correct
import AddIcon from '@mui/icons-material/Add';
import NonconformingNotificationForm from '../Forms/Quality/NonconformingNotificationForm';

const DiscrepancyReports = () => {
  const [reports, setReports] = useState([]);
  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [notificationData, setNotificationData] = useState({});
  const [loading, setLoading] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('/api/discrepancyReport');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchInspectionAndShipmentData = async (inspectionId, shipmentId) => {
    setLoading(true);
    try {
      const [inspectionResponse, shipmentResponse] = await Promise.all([
        axios.get(`/api/inspections/${inspectionId}`),
        axios.get(`/api/shipments/${shipmentId}`),
      ]);
      setSelectedReport((prevReport) => ({
        ...prevReport,
        inspection: inspectionResponse.data,
        shipment: shipmentResponse.data,
      }));
    } catch (error) {
      console.error('Error fetching inspection or shipment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async (report) => {
    setSelectedReport(report);
    setReadOnly(false);
    await fetchInspectionAndShipmentData(report.inspectionId._id, report.shipmentId._id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddReworkOperation = () => {
    setSelectedReport((prevReport) => ({
      ...prevReport,
      reworkOperations: [
        ...prevReport.reworkOperations,
        {
          os: '',
          workCenter: '',
          reworkInstructions: '',
          date: '',
          operatorId: '',
          runHr: '',
          quantityAccept: '',
          quantityReject: '',
          quantityScrap: '',
        },
      ],
    }));
  };

  const handleReworkChange = (e, index, field) => {
    const updatedReworkOperations = [...selectedReport.reworkOperations];
    updatedReworkOperations[index][field] = e.target.value;
    setSelectedReport((prevReport) => ({
      ...prevReport,
      reworkOperations: updatedReworkOperations,
    }));
  };

  const handleDeleteReworkOperation = (index) => {
    const updatedReworkOperations = selectedReport.reworkOperations.filter((_, i) => i !== index);
    setSelectedReport((prevReport) => ({
      ...prevReport,
      reworkOperations: updatedReworkOperations,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/discrepancyReport/${selectedReport._id}`, selectedReport);
      setReadOnly(true); // Make the form read-only after saving
      fetchReports(); // Refresh the list after update
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleGenerateNonconformingNotification = async (report) => {
    setNotificationData({
      discrepancyReportId: report._id,
      nonconformityDetails: report.discrepancyDetails,
      severityLevel: 'Minor', // Default value, change as needed
      notes: '',
    });
    setNotificationOpen(true);
  };

  const handleNotificationSave = async (data) => {
    try {
      await axios.post('/api/nonconformingNotifications', data);
      setNotificationOpen(false);
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Report ID</TableCell>
              <TableCell>Vendor Name</TableCell>
              <TableCell>Discrepancy Details</TableCell>
              <TableCell>At Fault</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report._id} hover onDoubleClick={() => handleOpen(report)}>
                <TableCell>{report.reportId}</TableCell>
                <TableCell>{report.vendorName}</TableCell>
                <TableCell>{report.discrepancyDetails}</TableCell>
                <TableCell>{report.atFault}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(report)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton onClick={() => handleGenerateNonconformingNotification(report)}>
                    <AddIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Discrepancy Report Details</DialogTitle>
        <DialogContent ref={printRef}>
          {loading ? (
            <CircularProgress />
          ) : (
            <InspectionReportPDF
              data={selectedReport}
              handleAddReworkOperation={handleAddReworkOperation}
              handleReworkChange={handleReworkChange}
              handleDeleteReworkOperation={handleDeleteReworkOperation}
              handleSave={handleSave}
              readOnly={readOnly}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          {!readOnly && <Button onClick={handleSave} color="primary">Save</Button>}
          <Button onClick={handlePrint} color="secondary">Print</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={notificationOpen} onClose={() => setNotificationOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nonconforming Notification</DialogTitle>
        <DialogContent>
          <NonconformingNotificationForm
            data={notificationData}
            onSave={handleNotificationSave}
            onCancel={() => setNotificationOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiscrepancyReports;
