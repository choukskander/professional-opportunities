// const Application = require('../models/Application');
// const Job = require('../models/Job');

// exports.createApplication = async (req, res) => {
//   const { jobId } = req.params;
//   const { resume, coverLetter } = req.body; // Get resume and coverLetter from req.body

//   // Basic validation (you can add more checks)
//   if (!resume) {
//     return res.status(400).json({ message: 'Resume is required' });
//   }

//   try {
//     const job = await Job.findById(jobId); 
//     if (!job) {
//       return res.status(404).json({ message: 'Job not found' });
//     }

//     const application = new Application({
//       user: req.user._id, // User ID from authentication
//       job: jobId, // Job ID from the URL parameter
//       resume, // Resume from req.body
//       coverLetter, // Cover letter from req.body
//     });

//     const createdApplication = await application.save();
//     res.status(201).json(createdApplication);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to create application' });
//   }
// };
// exports.getApplications = async (req, res) => {
//   const applications = await Application.find({ userId: req.user._id }).populate('jobId');
//   res.json(applications);
// };

// exports.getApplicationById = async (req, res) => {
//   const application = await Application.findById(req.params.id).populate('jobId');

//   if (application) {
//     res.json(application);
//   } else {
//     res.status(404).json({ message: 'Application not found' });
//   }
// };

// applicationController.js
const Application = require('../models/Application');
const Job = require('../models/Job');

exports.createApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Resume is required' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const application = new Application({
      user: req.user._id,
      job: jobId,
      resume: req.file.filename,
      coverLetter,
    });

    const createdApplication = await application.save();
    res.status(201).json(createdApplication);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create application', error: error.message });
  }
};

exports.getApplications = async (req, res) => {
  const applications = await Application.find({ userId: req.user._id }).populate('jobId');
  res.json(applications);
};

exports.getApplicationById = async (req, res) => {
  const application = await Application.findById(req.params.id).populate('jobId');

  if (application) {
    res.json(application);
  } else {
    res.status(404).json({ message: 'Application not found' });
  }
};

exports.getApplicationsForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job || job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const applications = await Application.find({ job: jobId }).populate('user', 'name email');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { jobId, applicationId } = req.params;

    const job = await Job.findById(jobId);
    if (!job || job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    const updatedApplication = await application.save();

    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};



