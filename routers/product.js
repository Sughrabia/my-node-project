const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const upload = require('../config/multerConfig');

router.post('/create', upload.fields([
  { name: 'imageUrl', maxCount: 1 },
  { name: 'additionalImages', maxCount: 5 }
]), async (req, res) => {
  try {
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    
    if (!req.files['imageUrl'] || req.files['imageUrl'].length === 0) {
      return res.status(400).json({ message: 'Main image file is required.' });
    }
    
    const { name, category, price, description } = req.body;
    const imageUrl = req.files['imageUrl'][0].path; // Main image
    const additionalImages = req.files['additionalImages'] 
      ? req.files['additionalImages'].map(file => file.path) 
      : []; // Additional images
    
    const newProduct = new Product({
      name,
      category,
      price,
      imageUrl,
      additionalImages,
      description,
    });
    
    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});



// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Server Error');
  }
});


router.get('/count', async (req, res) => {
  try {
    const userCount = await Product.countDocuments();
    res.json({ total: userCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user count' });
  }
});


// Get product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID format' });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});


// Update a product by ID
router.put('/edit/:id', upload.any([
  { name: 'imageUrl', maxCount: 1 },
  { name: 'additionalImages', maxCount: 5 }
]), async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const updatedProduct = await Product.findById(id);

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    updatedProduct.name = req.body.name || updatedProduct.name;
    updatedProduct.category = req.body.category || updatedProduct.category;
    updatedProduct.price = req.body.price || updatedProduct.price; 
    updatedProduct.description = req.body.description || updatedProduct.description;
    if (req.files['imageUrl'] && req.files['imageUrl'].length > 0) {
      updatedProduct.imageUrl = req.files['imageUrl'][0].path; 
    }

    if (req.files['additionalImages']) {
      updatedProduct.additionalImages = req.files['additionalImages'].map(file => file.path); 
    }

    await updatedProduct.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
