var express = require('express');
var router = express.Router();
const userController = require('../controllers/user')

/* POST users */
router.post('/register', userController.register);
router.post('/add-item-cart', userController.addItemToCart);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
