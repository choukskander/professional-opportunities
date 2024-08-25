const express = require('express');
const { getApplications, getApplicationById, createApplication, getJobApplicationStatistics, updateApplicationStatus, getJobApplicationStatistics2 } = require('../controllers/applicationController');
const { protect, hrProtect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddleware.js');


const router = express.Router();

router.get('/', protect, getApplications);
router.get('/:id', protect, getApplicationById);

router.post('/:jobId', protect, (req, res, next) => {
    upload.single('resume')(req, res, (err) => {
      if (err) {
        // Handle Multer errors
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  }, createApplication);
  router.get('/statistics/jobs-applications', protect,hrProtect, getJobApplicationStatistics);
  router.get('/statistics/jobs-applications2', protect,hrProtect, getJobApplicationStatistics2);
  router.put('/:jobId/applications/:applicationId/status', protect, hrProtect, updateApplicationStatus);
  
  module.exports = router;