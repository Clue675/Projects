const express = require('express');
const router = express.Router();

// Import the shipment controller
const shipmentController = require('../controllers/shipmentController');

// GET all shipments
router.get('/', shipmentController.getAllShipments);

// GET a single shipment by id
router.get('/:id', shipmentController.getShipmentById);

// POST a new shipment
router.post('/', shipmentController.createShipment);

// PUT to update a shipment
router.put('/:id', shipmentController.updateShipment);

// DELETE a shipment
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;
