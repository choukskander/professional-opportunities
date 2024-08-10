const express = require('express');
const { registerUser, loginUser, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User'); // Import the User model here

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile);

// Add this route for getting user details by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id); 
    if (user) {
      res.json(user); 
    } else {
      res.status(404).json({ message: 'User not found' }); 
    }
  } catch (error) {
    console.error('Error fetching user:', error); 
    res.status(500).json({ message: 'Error fetching user data' }); 
  }
});

// This is the route to update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id); 

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.skills = req.body.skills || user.skills;
      user.experience = req.body.experience || user.experience;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
});

module.exports = router;