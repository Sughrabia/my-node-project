// models/Shipping.js
const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
//   aptSuite: { type: String },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

module.exports = mongoose.model('Shipping', shippingSchema);
