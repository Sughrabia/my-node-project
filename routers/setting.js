const express = require('express');
const router = express.Router();
const Settings = require('../models/setting');
const multer = require('multer');

router.post('/create', async (req, res) => {
    const { title, logo } = req.body;
    try {
      // Check if settings already exist
      const existingSettings = await Settings.findOne();
      if (existingSettings) {
        return res.status(400).json({ message: 'Settings already exist' });
      }
  
      // Create new settings
      const newSettings = new Settings({ title, logo });
      await newSettings.save();
      res.status(201).json(newSettings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Adjust your file path as needed
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  const upload = multer({ storage });
  
  // PUT API to update settings
  router.put('/update', upload.single('logo'), async (req, res) => {
    const { title } = req.body;
    const logo = req.file ? `/uploads/${req.file.filename}` : undefined;
  
    try {
      // Update settings if they exist, or create them if they don't
      let settings = await Settings.findOne();
      if (!settings) {
        settings = new Settings();
      }
  
      settings.title = title || settings.title;
      if (logo) settings.logo = logo;
  
      await settings.save();
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ message: 'Error updating settings', error: error.message });
    }
  });
  
  // Get Settings API
  router.get('/get', async (req, res) => {
    try {
      const settings = await Settings.findOne();
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;