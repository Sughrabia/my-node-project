const express = require('express');
const router = express.Router();
const Order = require('../models/shipping');


router.post('/detail', async (req, res) => {
  try {
    const { cartItems, shippingDetails, paymentMethod, cartTotals } = req.body;

    // Validate required fields (add more validation as needed)
    if (!cartItems || !shippingDetails) {
      return res.status(400).json({ message: 'Cart items and shipping details are required.' });
    }

    // Calculate totalAmount (assuming you still want to use cartTotals for total amount calculation)
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create a new order document
    const newOrder = new Order({
      cartItems,
      shippingDetails,
      paymentMethod, // Store the payment method as well
      totalAmount
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = router;
