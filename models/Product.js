const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name: { type: String },
    code: { type:String },
    price: { type: Number },
    category: { type: String },
    inStock: { type: Number },
    image: { type: String }
});

const Product = mongoose.model('Product', productSchema)

module.exports = Product
