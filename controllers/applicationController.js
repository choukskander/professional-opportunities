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


exports.getJobApplicationStatistics2 = async (req, res) => {
  try {
    // Récupérer les jobs créés par l'utilisateur HR
    const jobs = await Job.find({ createdBy: req.user._id });

    // Calculer les statistiques pour chaque job
    const statistics = await Promise.all(
      jobs.map(async (job) => {
        const totalApplications = await Application.countDocuments({ job: job._id });
        const acceptedApplications = await Application.countDocuments({ job: job._id, status: 'accepted' });
        const rejectedApplications = await Application.countDocuments({ job: job._id, status: 'rejected' });

        return {
          jobTitle: job.title,
          totalApplications,
          acceptedApplications,
          rejectedApplications,
        };
      })
    );

    res.json(statistics);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
exports.getJobApplicationStatistics = async (req, res) => {
  try {
    // Récupérer les jobs créés par l'utilisateur HR
    const jobs = await Job.find({ createdBy: req.user._id });

    // Calculer les statistiques pour chaque job
    const statistics = await Promise.all(
      jobs.map(async (job) => {
        const totalApplications = await Application.countDocuments({ job: job._id });

        return {
          jobTitle: job.title,
          totalApplications,
        };
      })
    );

    res.json(statistics);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
exports.updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  const applicationId = req.params.applicationId; 
  const jobId = req.params.jobId; 

  try {
    // Update the application using the jobId and applicationId
    const updatedApplication = await Application.findOneAndUpdate(
      { _id: applicationId, job: jobId },
      { status },
      { new: true }
    );

    if (updatedApplication) {
      res.status(200).json(updatedApplication);
    } else {
      res.status(404).json({ error: 'Application not found' });
    }
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};