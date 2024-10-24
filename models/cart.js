const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    price: Number,
    imageUrl: String,
  });
  
  const CartItem = mongoose.model('CartItem', cartItemSchema);

  module.exports =CartItem;