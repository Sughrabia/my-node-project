// routes/shipping.js
const express = require('express');
const router = express.Router();
const Shipping = require('../models/shipping');

// Route to handle form submission
router.post('/', async (req, res) => {
  try {
    const shippingData = new Shipping(req.body);
    await shippingData.save();
    res.status(201).json({ message: 'Shipping data saved successfully!' });
  } catch (error) {
    res.status(400).json({ message: 'Error saving shipping data', error });
  }
});


router.get('/orders', async (req, res) => {
    try {
      const orders = await Shipping.find();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch orders', error });
    }
  });

  


module.exports = router;
