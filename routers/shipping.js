const express = require('express');
const router = express.Router();
const Order = require('../models/shipping');

// POST route to create a new order
router.post('/order', async (req, res) => {
  try {
    const { cartItems, shippingDetails, totalAmount } = req.body;

    const newOrder = new Order({
      cartItems,
      shippingDetails,
      totalAmount,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// GET route to fetch all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = router;
