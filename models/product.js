// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: [true, 'Price is required'] },
  imageUrl: { type: String, required: true },
  additionalImages: [{ type: String }],
  description: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;

