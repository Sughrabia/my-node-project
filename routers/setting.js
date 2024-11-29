const express = require('express');
const router = express.Router();
const Settings = require('../models/setting');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });  // Ensure the folder is created if it doesn't exist
  console.log('Uploads directory created.');
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Upload to 'images/' directory
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + '-' + file.originalname;  // Create a unique filename
    cb(null, filename); // Use the correct filename
  },
});
const upload = multer({ storage });

// API to get settings
router.get('/get', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    console.log('Settings retrieved:', settings);
    res.status(200).json(settings); // Return settings if found
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: error.message });
  }
});

// API to create new settings
router.post('/create', async (req, res) => {
  const { title, logo } = req.body;
  try {
    const existingSettings = await Settings.findOne();
    if (existingSettings) {
      return res.status(400).json({ message: 'Settings already exist' });
    }

    const newSettings = new Settings({ title, logo });
    await newSettings.save();
    res.status(201).json(newSettings);
  } catch (error) {
    console.error('Error creating settings:', error);
    res.status(500).json({ message: error.message });
  }
});

// API to update settings
router.put('/update', upload.single('logo'), async (req, res) => {
  console.log('Request body:', req.body);  // Log body data (title)
  console.log('Uploaded file:', req.file);  // Log the uploaded file data

  const { title } = req.body;
  const logo = req.file ? `/images/${req.file.filename}` : undefined; // Assign logo path if a file was uploaded

  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(); // Create new settings if not found
    }

    settings.title = title || settings.title;  // Update title if new one provided
    if (logo) settings.logo = logo;  // Update logo if file is uploaded

    await settings.save();  // Save updated settings
    res.status(200).json(settings);  // Return the updated settings
  } catch (error) {
    console.error('Error during update:', error);  // Log detailed error message
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
});

module.exports = router;
