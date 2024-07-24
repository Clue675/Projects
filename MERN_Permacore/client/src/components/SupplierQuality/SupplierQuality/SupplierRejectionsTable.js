import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'DR Number', width: 150 },
  { field: 'vendorName', headerName: 'Vendor Name', width: 180 },
  { field: 'partNumber', headerName: 'Part Number', width: 130 },
  { field: 'quantityReceived', headerName: 'Quantity Received', type: 'number', width: 150 },
  { field: 'quantityRejected', headerName: 'Quantity Rejected', type: 'number', width: 150 },
  { field: 'rejectionCodes', headerName: 'Rejection Codes', width: 150 },
  { field: 'atFault', headerName: 'At Fault', width: 120 },
  { field: 'inspectionDate', headerName: 'Inspection Date', width: 160, type: 'date' },
  { field: 'notes', headerName: 'Notes', width: 200, sortable: false },
  { field: 'inspectorFirstName', headerName: 'Inspector First Name', width: 150 },
  { field: 'inspectorLastName', headerName: 'Inspector Last Name', width: 150 },
  { field: 'inspectorBadgeNumber', headerName: 'Inspector Badge Number', width: 150 },
];

const rows = [
  {
    id: 'DR-001',
    vendorName: 'Vendor A',
    partNumber: 'PN-001',
    quantityReceived: 100,
    quantityRejected: 5,
    rejectionCodes: 'RC-01',
    atFault: 'Vendor',
    inspectionDate: new Date(),
    notes: 'Some notes here',
    inspectorFirstName: 'John',
    inspectorLastName: 'Doe',
    inspectorBadgeNumber: '12345',
  },
  // Add more rows here...
];

const SupplierRejectionsTable = () => {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} />
    </div>
  );
};

export default SupplierRejectionsTable;
