const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  resume: { type: String, required: true },
  coverLetter: { type: String },
  status: { type: String, enum: ['applied', 'interview', 'accepted', 'rejected'], default: 'applied' },
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Application', ApplicationSchema);
