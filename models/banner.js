const mongoose = require('mongoose');

// Define the Banner schema
const bannerSchema = new mongoose.Schema({
  heading: String,
  text: [String], // Array of strings (for text)
  buttonLabel: String,
  imageUrl: String,
  category: String,
});

// Create the model
const BannerModel = mongoose.model('Banner', bannerSchema);

module.exports = BannerModel;
