const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const cloudinary = require('cloudinary').v2;


cloudinary.config({
  cloud_name: 'dhbqy5xmu',
  api_key: '143547791298877',
  api_secret: 'UxTnEk-Luv4m2RyYmqzslLMdmeg'
});

module.exports.add = (req, res) => {

  
  Product.create(req.body, (err, product) => {

    return res.status(200).send(product)
  })
}

module.exports.list = (req, res) => {
  
  Product.find((err, products) => {
    
    return res.status(200).send(products);
  });
}

module.exports.listByCategory = (req, res) => {

  let receivedCategory = req.query.category ? req.query.category : '';
  
  Product.find({ category: receivedCategory }, (err, products) => {
    
    return res.status(200).send(products);
  });
}