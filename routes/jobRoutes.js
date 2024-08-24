// jobRoutes.js
const express = require('express');
const {
  addJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getLatestJobs,
} = require('../controllers/jobController');
const { protect, hrProtect, hr } = require('../middleware/authMiddleware');
const { getApplicationsForJob, updateApplicationStatus } = require('../controllers/applicationController');

const router = express.Router();

router.post('/', protect, hrProtect, addJob);
router.get('/latest', getLatestJobs);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.put('/:id', protect, hrProtect, updateJob);
router.delete('/:id', protect, hrProtect, deleteJob);
router.route('/:jobId/applications').get(protect, hrProtect, getApplicationsForJob); // Use hrProtect here

// Update the status of an application (HR only)
router.route('/:jobId/applications/:applicationId').put(protect, hrProtect, updateApplicationStatus); // Use hrProtect here



module.exports = router;