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

const Application = require('../models/Application');
const Job = require('../models/Job');

exports.createApplication = async (req, res) => {
  try {
    console.log('Received request to create application');
    
    const { jobId } = req.params;
    const { coverLetter } = req.body;
    console.log('Job ID:', jobId);
    console.log('Cover Letter:', coverLetter);
    
    // Check if file was uploaded
    if (!req.file) {
      console.log('No resume uploaded');
      return res.status(400).json({ message: 'Resume is required' });
    }
    
    console.log('Uploaded Resume:', req.file.filename);

    // Find the job by ID
    const job = await Job.findById(jobId);
    if (!job) {
      console.log('Job not found with ID:', jobId);
      return res.status(404).json({ message: 'Job not found' });
    }
    
    console.log('Job found:', job);

    // Create a new application
    const application = new Application({
      user: req.user._id,
      job: jobId,
      resume: req.file.filename, // Save filename in the database
      coverLetter,
    });

    console.log('Creating new application:', application);

    // Save the application to the database
    const createdApplication = await application.save();
    console.log('Application created successfully:', createdApplication);
    
    res.status(201).json(createdApplication);
  } catch (error) {
    console.error('Error creating application:', error);
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