const Job = require('../models/Job');

exports.addJob = async (req, res) => {
  const { title, description, company, location, type } = req.body; // Get data from req.body

  // Validate that all required fields are present
  if (!title || !description || !company || !location || !type) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const job = new Job({
    title,
    description,
    company,
    location,
    type,
    createdBy: req.user._id,
  });

  const createdJob = await job.save();
  res.status(201).json(createdJob);
};

exports.getJobs = async (req, res) => {
  const keyword = req.query.keyword ? {
    $or: [
      { title: { $regex: req.query.keyword, $options: 'i' } },
      { description: { $regex: req.query.keyword, $options: 'i' } },
      { company: { $regex: req.query.keyword, $options: 'i' } },
      { location: { $regex: req.query.keyword, $options: 'i' } },
      { type: { $regex: req.query.keyword, $options: 'i' } },
    ],
  } : {};

  const jobs = await Job.find(keyword)
    .populate('createdBy'); // Populate createdBy field 
  res.json(jobs);
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id); // No need to check for null here 

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid job ID' }); // Handle invalid ObjectId specifically
    }
    res.status(500).json({ message: 'Error getting job' });
  }
};

exports.updateJob = async (req, res) => {
  const { title, description, company, location, type } = req.body;

  const job = await Job.findById(req.params.id);

  if (job) {
    job.title = title || job.title;
    job.description = description || job.description;
    job.company = company || job.company;
    job.location = location || job.location;
    job.type = type || job.type;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } else {
    res.status(404).json({ message: 'Job not found' });
  }
};

exports.deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (job) {
    await job.remove();
    res.json({ message: 'Job removed' });
  } else {
    res.status(404).json({ message: 'Job not found' });
  }
};

