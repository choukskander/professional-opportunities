const express = require('express');
const { getApplications, getApplicationById, createApplication } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddleware.js');


const router = express.Router();

router.get('/', protect, getApplications);
router.get('/:id', protect, getApplicationById);

// Add new route for creating application (with multer middleware)
router.post('/:jobId', protect, upload.single('resume'), createApplication);

module.exports = router;