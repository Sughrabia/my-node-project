const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  cartItems: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number,
    // Other item properties...
  }],
  shippingDetails: {
    firstName: String,
    lastName: String,
    email: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String
  },
  paymentMethod: String,
  totalAmount: Number
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
