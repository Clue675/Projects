import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

const VendorCertificationTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/vendor/vendor-certifications')
      .then(response => setData(response.data.map((item, index) => ({ ...item, id: index }))))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const columns = [
    { field: 'vendorName', headerName: 'Vendor Name', width: 150 },
    { field: 'certificateName', headerName: 'Certificate Name', width: 150 },
    { field: 'issuedDate', headerName: 'Issued Date', width: 110 },
    { field: 'expirationDate', headerName: 'Expiration Date', width: 110 },
    // Add more columns as needed
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={data} columns={columns} pageSize={5} />
    </div>
  );
};

export default VendorCertificationTable;
