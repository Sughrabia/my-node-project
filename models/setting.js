
const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  logo: {
    type: String, 
    required: true,
  },
});

module.exports = mongoose.model('Settings', SettingsSchema);
