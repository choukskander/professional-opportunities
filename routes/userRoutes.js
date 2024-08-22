const express = require('express');
const { registerUser, loginUser, updateUserProfile } = require('../controllers/userController');
const { protect, hrProtect } = require('../middleware/authMiddleware');
const fileUpload = require('express-fileupload');
const User = require('../models/User');

const router = express.Router();

// Middleware to handle file uploads
router.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  createParentPath: true,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
}));

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

// New route for HR to view user profiles
router.get('/view/:id', protect, hrProtect, async (req, res) => {
  try {
    const user = awaitUser.findById(req.params.id);
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

module.exports = router;
