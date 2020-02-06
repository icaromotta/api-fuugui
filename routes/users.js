var express = require('express');
var router = express.Router();
const userController = require('../controllers/user')

router.post('/register', userController.register);
router.put('/add-item-cart', userController.addItemToCart);
router.put('/remove-item-cart', userController.removeItemFromCart);
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
