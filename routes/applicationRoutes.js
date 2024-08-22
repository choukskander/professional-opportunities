const express = require('express');
const { getApplications, getApplicationById, createApplication } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddleware.js');


const router = express.Router();

router.get('/', protect, getApplications);
router.get('/:id', protect, getApplicationById);

// Add new route for creating application (with multer middleware)
// router.post('/:jobId', protect, upload.single('resume'), createApplication);
router.post('/:jobId', protect, (req, res, next) => {
    upload.single('resume')(req, res, (err) => {
      if (err) {
        // Handle Multer errors
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  }, createApplication);
module.exports = router;