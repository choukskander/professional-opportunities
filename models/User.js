const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['jobSeeker', 'hr'], required: true },
  skills: [String],
  experience: [
    {
      title: { type: String, required: true },
      company: { type: String, required: true },
      location: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date }, // Optional - can be null if the user is still at the job
      description: { type: String },
    },
  ],
  profileImage: { type: String }, // Add profileImage field
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  followedCompanies: [String],
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);