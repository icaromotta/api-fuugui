const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  name: { type: String },
  email: { type: String },
  wallet: { type: Number, default: '1000' },
  cart: [
    {
      code: { type: String },
      amount: { type: Number }
    }
  ]
});

const User = mongoose.model('User', userSchema)

module.exports = User