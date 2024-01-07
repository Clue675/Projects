import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/vendors');
        setVendors(response.data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchVendors();
  }, []);

  return (
    <List>
      {vendors.map((vendor) => (
        <ListItem key={vendor.id}>
          <ListItemText
            primary={vendor.vendor_name}
            secondary={`Email: ${vendor.email_address}, Address: ${vendor.street_address}, City: ${vendor.city}, State: ${vendor.state}, ZIP: ${vendor.zip_code}`}
            // Add more fields as needed
          />
        </ListItem>
      ))}
    </List>
  );
};

export default VendorList;
