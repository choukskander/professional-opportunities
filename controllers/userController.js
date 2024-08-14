const User = require('../models/User');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
  const { name, email, password, role, skills, experience } = req.body;
  console.log("Received registration data:", req.body);
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const user = await User.create({ name, email, password, role, skills, experience });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.skills = req.body.skills ? JSON.parse(req.body.skills) : user.skills;
      user.experience = req.body.experience ? JSON.parse(req.body.experience) : user.experience; 
      if (req.body.role) {
        user.role = req.body.role;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      //Upload image to Cloudinary
      if (req.files && req.files.profileImage) {
        const profileImage = req.files.profileImage;
        
        // Assurez-vous que le chemin temporaire est disponible
        if (profileImage.tempFilePath) {
          const result = await cloudinary.uploader.upload(profileImage.tempFilePath);
          user.profileImage = result.secure_url;
        } else {
          throw new Error('No temporary file path available for the uploaded image.');
        }
      }
      

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
        profileImage: updatedUser.profileImage ,
        skills: updatedUser.skills,
        experience: updatedUser.experience
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
};