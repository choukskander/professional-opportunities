const express = require('express');
const { getApplications, getApplicationById } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getApplications);
router.get('/:id', protect, getApplicationById);

module.exports = router;
