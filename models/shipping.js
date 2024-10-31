// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  cartItems: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  shippingDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  totalAmount: { type: Number, required: true },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
