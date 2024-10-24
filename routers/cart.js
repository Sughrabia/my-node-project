const express = require('express');
const router = express.Router();
const CartItem= require('../models/cart')

router.get('/', async (req, res) => {
    try {
      const cartItems = await CartItem.find();
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching cart items' });
    }
  });
  
  // API to add item to cart
  router.post('/add', async (req, res) => {
    const { name, size, color, quantity, price, imageUrl } = req.body;
  
    const newCartItem = new CartItem({ name, size, color, quantity, price, imageUrl });
  
    try {
      await newCartItem.save();
      res.status(201).json(newCartItem);
    } catch (error) {
      res.status(500).json({ error: 'Error adding item to cart' });
    }
  });
  
  // API to remove item from cart
  router.delete('/remove/:id', async (req, res) => {
    try {
      await CartItem.findByIdAndDelete(req.params.id);
      res.status(204).json({ message: 'Item removed from cart' });
    } catch (error) {
      res.status(500).json({ error: 'Error removing item from cart' });
    }
  });


  module.exports = router;  