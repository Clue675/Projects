// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { jsPDF } from "jspdf";
// import html2canvas from 'html2canvas';
// import { Button, TextField, List, ListItem, CircularProgress, Alert, ListItemText, Paper, Container, Typography, Box } from '@mui/material';

// const NonconformingNotificationComponent = () => {
//     const [notifications, setNotifications] = useState([]);
//     const [reportId, setReportId] = useState('');
//     const [action, setAction] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const notificationRef = useRef();

//     useEffect(() => {
//         fetchNotifications();
//     }, []);

//     const fetchNotifications = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get('http://localhost:5000/api/discrepancy/notifications');
//             setNotifications(response.data);
//             setError(null);
//         } catch (err) {
//             console.error('Error fetching notifications:', err);
//             setError('Failed to fetch notifications');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCreateNotification = async () => {
//         if (!reportId || !action) {
//             setError('Please fill in all fields');
//             return;
//         }

//         setLoading(true);
//         try {
//             await axios.post('http://localhost:5000/api/discrepancy/notifications/create', { report_id: reportId, action });
//             setReportId('');
//             setAction('');
//             fetchNotifications();
//         } catch (err) {
//             console.error('Error creating notification:', err);
//             setError('Failed to create notification');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const generatePDF = async () => {
//         const pdf = new jsPDF('p', 'pt', 'a4');
//         const data = await html2canvas(notificationRef.current);
//         const img = data.toDataURL('image/png');

//         pdf.addImage(img, 'PNG', 0, 0);
//         pdf.save('nonconforming-notification.pdf');
//     };

//     return (
//         <Container maxWidth="md">
//             <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
//                 <Typography variant="h4" gutterBottom>Create Nonconforming Notification</Typography>
//                 <Box display="flex" gap={2} alignItems="center" mb={2}>
//                     <TextField
//                         label="Report ID"
//                         value={reportId}
//                         onChange={(e) => setReportId(e.target.value)}
//                         fullWidth
//                     />
//                     <TextField
//                         label="Action"
//                         value={action}
//                         onChange={(e) => setAction(e.target.value)}
//                         fullWidth
//                     />
//                     <Button variant="contained" color="primary" onClick={handleCreateNotification}>
//                         Create Notification
//                     </Button>
//                 </Box>

//                 {loading && <CircularProgress />}
//                 {error && <Alert severity="error">{error}</Alert>}

//                 <Button variant="contained" color="secondary" onClick={generatePDF} sx={{ mt: 2 }}>
//                     Generate PDF
//                 </Button>

//                 <Typography variant="h5" gutterBottom mt={3}>Existing Notifications</Typography>
//                 <List>
//                     {notifications.map((notification, index) => (
//                         <ListItem key={index} divider>
//                             <ListItemText 
//                                 primary={`ID: ${notification.notification_id}, Action: ${notification.action}`}
//                                 secondary={`Part Number: ${notification.part_number}, Order ID: ${notification.order_id}, Rejection Code: ${notification.rejection_code}, Issue Details: ${notification.issue_details}`}
//                             />
//                         </ListItem>
//                     ))}
//                 </List>
//             </Paper>

//             <div ref={notificationRef} style={{ display: 'none' }}>
//                 <Typography variant="h4">Nonconforming Notification Report</Typography>
//                 {notifications.map((notification, index) => (
//                     <div key={index}>
//                         <h3>Notification ID: {notification.notification_id}</h3>
//                         <p>Action: {notification.action}</p>
//                         <p>Part Number: {notification.part_number}</p>
//                         <p>Order ID: {notification.order_id}</p>
//                         <p>Rejection Code: {notification.rejection_code}</p>
//                         <p>Issue Details: {notification.issue_details}</p>
//                     </div>
//                 ))}
//             </div>
//         </Container>
//     );
// };

// export default NonconformingNotificationComponent;
