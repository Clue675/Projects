import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

const InspectionBacklogComponent = () => {
    const [pendingInspections, setPendingInspections] = useState([]);

    useEffect(() => {
        const fetchPendingInspections = async () => {
            try {
                const response = await axios.get('/api/inspections/pending');
                setPendingInspections(response.data.map(inspection => ({
                    ...inspection,
                    id: inspection._id, // DataGrid requires a unique 'id' field
                })));
            } catch (error) {
                console.error('Error fetching pending inspections:', error);
            }
        };

        fetchPendingInspections();
    }, []);

    const columns = [
        { field: 'inspectionId', headerName: 'Inspection ID', width: 120 },
        { field: 'vendorName', headerName: 'Vendor Name', width: 150 },
        { field: 'purchaseOrderNumber', headerName: 'PO Number', width: 120 },
        { field: 'inspectionDate', headerName: 'Inspection Date', width: 150, type: 'date' },
        { field: 'status', headerName: 'Status', width: 130 },
        // Additional columns can be added as needed
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={pendingInspections}
                columns={columns}
                pageSize={5}
                checkboxSelection
            />
        </div>
    );
};

export default InspectionBacklogComponent;
