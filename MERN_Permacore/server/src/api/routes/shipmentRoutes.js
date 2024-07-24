const express = require('express');
const router = express.Router();

// Import the shipment controller
const shipmentController = require('../controllers/shipmentController');

// Middleware for authentication - Placeholder (uncomment and adjust according to your auth system)
// const { isAuthenticated } = require('../middleware/authMiddleware');

// Middleware for validating request payloads - Placeholder
// const validateShipment = require('../middleware/validateShipmentMiddleware');

router.get('/openShipments', shipmentController.getOpenShipments);
// GET all shipments
// Adding isAuthenticated middleware as an example of how to protect a route
router.get('/', /* isAuthenticated, */ shipmentController.getAllShipments);


// POST a new shipment - Including an example of validation middleware
router.post('/', /* isAuthenticated, validateShipment, */ shipmentController.createShipment);

// GET a single shipment by id
// Note: This is moved above dynamic :id routes to prevent overshadowing
router.get('/:id', /* isAuthenticated, */ shipmentController.getShipmentById);

// PUT to update a shipment - Assuming validation would be similar to creation
router.put('/:id', /* isAuthenticated, validateShipment, */ shipmentController.updateShipment);

// DELETE a shipment
router.delete('/:id', /* isAuthenticated, */ shipmentController.deleteShipment);

// New route to check inspection status for a specific shipment
router.get('/:id/inspectionStatus', /* isAuthenticated, */ async (req, res) => {
    try {
        const shipmentId = req.params.id;
        const isInspected = await shipmentController.checkInspectionStatus(shipmentId);
        
        res.status(200).json({ inspected: isInspected });
    } catch (error) {
        console.error('Error checking inspection status:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;
