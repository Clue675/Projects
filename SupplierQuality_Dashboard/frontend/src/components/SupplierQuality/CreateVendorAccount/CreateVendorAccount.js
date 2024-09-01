import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';
import UploadVendorCert from './UploadVendorCerts';

const SupplierQualityForm = ({ vendorId }) => {
    const [vendorData, setVendorData] = useState({
        vendor_name: '',
        company_address: '',
        city: '',
        state: '',
        zip: '',
        phone_number: '',
        email: '',
        title: '',
        last_audit_date: '',
        next_audit_date: '',
        comments: ''
    });
    const [certificateUploaded, setCertificateUploaded] = useState(false);

    useEffect(() => {
        if (vendorId) {
            axios.get(`/api/vendor/${vendorId}`)
                .then(response => setVendorData(response.data.vendor))
                .catch(error => console.error('Error fetching vendor data:', error));
        }
    }, [vendorId]);

    const handleChange = (e) => {
        setVendorData({ ...vendorData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!vendorData.vendor_name || !certificateUploaded) {
            alert('Please fill all required fields and upload the certificate.');
            return;
        }

        const status = determineStatus(vendorData.last_audit_date, vendorData.next_audit_date);
        const payload = { ...vendorData, status };

        try {
            const apiEndpoint = vendorId ? `/api/vendor/update/${vendorId}` : '/api/vendor/create';
            const response = await axios.post(apiEndpoint, payload);
            console.log(response.data);
            alert('Vendor data submitted successfully!');
        } catch (error) {
            console.error('Error submitting vendor data:', error);
            alert('Submission failed');
        }
    };

    const determineStatus = (lastAuditDate, nextAuditDate) => {
        const currentDate = new Date();
        const lastAudit = new Date(lastAuditDate);
        const nextAudit = new Date(nextAuditDate);

        if (isNaN(lastAudit.getTime()) || isNaN(nextAudit.getTime())) {
            return 'Pending';
        }

        const lastAuditThreshold = 2 * 365 * 24 * 60 * 60 * 1000;

        if (currentDate < nextAudit && (currentDate - lastAudit) < lastAuditThreshold) {
            return 'Active';
        }

        if (currentDate >= nextAudit || (currentDate - lastAudit) >= lastAuditThreshold) {
            return 'Inactive';
        }

        return 'Review';
    };

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', my: 4 }}>
            <Typography variant="h6">{vendorId ? 'Edit Vendor' : 'Create New Vendor'}</Typography>
            <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Vendor Name" name="vendor_name" value={vendorData.vendor_name} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Company Address" name="company_address" value={vendorData.company_address} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="City" name="city" value={vendorData.city} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="State" name="state" value={vendorData.state} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Zip Code" name="zip" value={vendorData.zip} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Phone Number" name="phone_number" value={vendorData.phone_number} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Email" name="email" value={vendorData.email} onChange={handleChange} margin="normal" type="email" />
                <TextField fullWidth label="Title" name="title" value={vendorData.title} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Last Audit Date" name="last_audit_date" type="date" InputLabelProps={{ shrink: true }} value={vendorData.last_audit_date} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Next Audit Date" name="next_audit_date" type="date" InputLabelProps={{ shrink: true }} value={vendorData.next_audit_date} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Comments" name="comments" multiline rows={4} value={vendorData.comments} onChange={handleChange} margin="normal" />
                <UploadVendorCert setCertificateUploaded={setCertificateUploaded} />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    {vendorId ? 'Update Vendor' : 'Create Vendor'}
                </Button>
            </form>
        </Box>
    );
};

export default SupplierQualityForm;
