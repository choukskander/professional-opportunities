const Application = require('../models/Application');

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
