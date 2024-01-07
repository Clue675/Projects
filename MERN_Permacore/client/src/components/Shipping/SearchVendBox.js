import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, List, ListItem, TextField } from '@mui/material';
import axios from 'axios';

const SearchVendorBox = ({ onSelect }) => {
    const [open, setOpen] = useState(false);
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

        fetchVendors();
    }, []);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api/vendors?search=${searchTerm}`);
            setVendors(response.data);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
    };

    const handleSelect = (vendor) => {
        onSelect(vendor);
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Search Vendor</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    placeholder="Search by vendor name or ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <List>
                    {vendors.map((vendor) => (
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

