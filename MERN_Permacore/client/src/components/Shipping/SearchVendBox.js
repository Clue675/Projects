import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, List, ListItem, TextField } from '@mui/material';
import axios from 'axios';

const SearchVendorBox = ({ open, onClose, onSelect }) => {
    const [vendors, setVendors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await axios.get('/api/vendors'); // Replace with your actual API endpoint
                setVendors(response.data);
            } catch (error) {
                console.error('Error fetching vendors:', error);
            }
        };

        if (open) {
            fetchVendors();
        }
    }, [open]);

    const handleSelect = (vendor) => {
        onSelect({
            vendorId: vendor._id,
            vendorName: vendor.vendorName,
            vendorNumber: vendor.vendorNumber,
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Search Vendor</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    placeholder="Search by vendor name or ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <List>
                    {vendors.filter(vendor => vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) || vendor.vendorNumber.toString().includes(searchTerm)).map((vendor) => (
                        <ListItem button key={vendor._id} onClick={() => handleSelect(vendor)}>
                            {vendor.vendorName}
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default SearchVendorBox;
