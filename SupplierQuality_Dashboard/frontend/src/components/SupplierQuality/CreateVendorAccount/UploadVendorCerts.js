import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';

const UploadCertificateForm = ({ vendorId }) => {
    const [certificateData, setCertificateData] = useState({
        certificate_name: '',
        issued_date: '',
        expiration_date: '',
        issued_by: '',
        file: null
    });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    // Handles input field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCertificateData({ ...certificateData, [name]: value });
    };

    // Handles file input changes
    const handleFileChange = (e) => {
        setCertificateData({ ...certificateData, file: e.target.files[0] });
    };

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if file is selected
        if (!certificateData.file) {
            setError('Please select a file to upload');
            return;
        }

        setError('');
        setUploading(true);

        const formData = new FormData();
        formData.append('certificate_name', certificateData.certificate_name);
        formData.append('issued_date', certificateData.issued_date);
        formData.append('expiration_date', certificateData.expiration_date);
        formData.append('issued_by', certificateData.issued_by);
        formData.append('file', certificateData.file);

        // Submit the form data
        try {
            const response = await axios.post(`/api/vendor/${vendorId}/certificates`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Certificate uploaded successfully!');
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading certificate:', error);
            setError('Failed to upload certificate. Please try again.');
        }

        setUploading(false);
    };

    // Render the form
    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', my: 4 }}>
            <Typography variant="h6">Upload Vendor Certificate</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Certificate Name"
                    name="certificate_name"
                    value={certificateData.certificate_name}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Issued Date"
                    name="issued_date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={certificateData.issued_date}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Expiration Date"
                    name="expiration_date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={certificateData.expiration_date}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Issued By"
                    name="issued_by"
                    value={certificateData.issued_by}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.png,.doc,.docx"
                    style={{ marginBottom: '10px' }}
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={uploading}>
                    {uploading ? <CircularProgress size={24} /> : 'Upload Certificate'}
                </Button>
            </form>
        </Box>
    );
};

export default UploadCertificateForm;
