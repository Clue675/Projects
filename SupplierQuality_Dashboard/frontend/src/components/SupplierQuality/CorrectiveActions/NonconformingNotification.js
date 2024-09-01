import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, List, ListItem, CircularProgress, Alert, ListItemText } from '@mui/material';

const NonconformingNotificationComponent = () => {
    const [notifications, setNotifications] = useState([]);
    const [reportId, setReportId] = useState('');
    const [action, setAction] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/discrepancy/notifications');
            setNotifications(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNotification = async () => {
        if (!reportId || !action) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/discrepancy/notifications/create', { report_id: reportId, action });
            setReportId('');
            setAction('');
            fetchNotifications();
        } catch (err) {
            console.error('Error creating notification:', err);
            setError('Failed to create notification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Create Nonconforming Notification</h2>
            <TextField
                label="Report ID"
                value={reportId}
                onChange={(e) => setReportId(e.target.value)}
            />
            <TextField
                label="Action"
                value={action}
                onChange={(e) => setAction(e.target.value)}
            />
            <Button onClick={handleCreateNotification}>Create Notification</Button>

            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}

            <h2>Existing Notifications</h2>
            <List>
                {notifications.map((notification, index) => (
                    <ListItem key={index}>
                        <ListItemText 
                            primary={`ID: ${notification.notification_id}, Action: ${notification.action}`}
                            secondary={`Part Number: ${notification.part_number}, Order ID: ${notification.order_id}, Rejection Code: ${notification.rejection_code}, Issue Details: ${notification.issue_details}`}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default NonconformingNotificationComponent;
