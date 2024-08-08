const express = require('express');
const { addJob, getJobs, getJobById, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, hrProtect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, hrProtect, addJob);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.put('/:id', protect, hrProtect, updateJob);
router.delete('/:id', protect, hrProtect, deleteJob);

module.exports = router;
