const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  code: { type: String },
  name: { type: String },
  amount: { type: Number }
});

const userSchema = new mongoose.Schema({

  name: { type: String },
  email: { type: String },
  wallet: { type: Number, default: '1000' },
  cart: [cartSchema]
});

const User = mongoose.model('User', userSchema)

module.exports = User