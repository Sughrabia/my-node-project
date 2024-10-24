const express = require('express');
const mongoose = require('mongoose'); 
const router = express.Router();
const User = require('../models/login');

// Route to fetch all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find(); 
        res.status(200).json(users);     
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/count', async (req, res) => {
    try {
      const userCount = await User.countDocuments();
      res.json({ total: userCount });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user count' });
    }
  });
  


  

// Route to delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

module.exports = router;
