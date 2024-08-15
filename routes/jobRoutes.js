const express = require('express');
const { addJob, getJobs, getJobById, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, hrProtect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new job
router.post('/', protect, hrProtect, addJob); 

// Get all jobs
router.get('/', getJobs);

// Get a specific job by ID
router.get('/:id', getJobById);

// Update a job by ID
router.put('/:id', protect, hrProtect, updateJob); 

// Delete a job by ID
router.delete('/:id', protect, hrProtect, deleteJob);

module.exports = router;