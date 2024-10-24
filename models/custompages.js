// models/Page.js
const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  content: { type: String, required: true }, 
  slug: { type: String, required: true, unique: true },
  lastUpdated: { type: Date, default: Date.now }
});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
