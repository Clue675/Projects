const express = require('express');
const router = express.Router();

// Import the rejection code controller
const rejectionCodeController = require('../controllers/rejectionCodeController');

// GET all rejection codes
router.get('/', rejectionCodeController.getAllRejectionCodes);

// GET a single rejection code by id
router.get('/:id', rejectionCodeController.getRejectionCodeById);

// POST a new rejection code
router.post('/', rejectionCodeController.createRejectionCode);

router.post('/check-duplicate', async (req, res) => {
    try {
        const { codeId, codeNumber, category } = req.body;

        // Validate input
        if (!codeId || !codeNumber || !category) {
            return res.status(400).json({ message: 'Code ID, Code Number, and Category are required.' });
        }

        const existingCode = await RejectionCode.findOne({ codeId, codeNumber, category });
        res.status(200).json({ exists: !!existingCode });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// PUT to update a rejection code
router.put('/:id', rejectionCodeController.updateRejectionCode);

// DELETE a rejection code
router.delete('/:id', rejectionCodeController.deleteRejectionCode);

module.exports = router;
