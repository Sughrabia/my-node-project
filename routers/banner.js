const express = require('express');
const multer = require('multer');
const BannerModel = require('../models/banner'); 
const upload = require('../config/multerConfig'); 
const router = express.Router();


router.post('/create', upload.single('image'), async (req, res) => { 
  const { heading, text, buttonLabel, category } = req.body;
  
  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }
  
  try {
    const imageUrl = req.file ? req.file.path : null; 

    const newBanner = new BannerModel({
      heading,
      text,
      buttonLabel,
      imageUrl,  
      category
    });

    await newBanner.save();
    res.status(201).json(newBanner);
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ error: 'Error creating banner' });
  }
});

// Route to get the banner data
router.get('/', async (req, res) => {
  const { category } = req.query;

  try {
    const query = category ? { category } : {}; 
    const banners = await BannerModel.find(query);
    res.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ message: 'Error fetching banners' });
  }
});


router.get('/count', async (req, res) => {
  try {
    const userCount = await BannerModel.countDocuments();
    res.json({ total: userCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user count' });
  }
});



const mongoose = require('mongoose');

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Fetching banner with ID: ${id}`); 

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const banner = await BannerModel.findById(id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.json(banner);
  } catch (error) {
    console.error('Error fetching banner:', error); 
    res.status(500).json({ message: 'Error fetching banner' });
  }
});



// Delete banner route
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBanner = await BannerModel.findByIdAndDelete(id);  
    
    if (!deletedBanner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    
    res.json({ message: 'Banner deleted successfully', deletedBanner });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ message: 'Error deleting banner' });
  }
});

// Update a banner by ID
router.put('/edit/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { heading, text, buttonLabel, category } = req.body;
  const imageUrl = req.file ? req.file.path : req.body.imageUrl; // handle the image update

  try {
    const updatedBanner = await BannerModel.findByIdAndUpdate(
      id,
      { heading, text, buttonLabel, category, imageUrl },
      { new: true } // return updated document
    );

    if (!updatedBanner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.status(200).json(updatedBanner);
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
