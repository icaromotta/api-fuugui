var express = require('express');
var router = express.Router();
const productController = require('../controllers/product')

/* POST users */
router.post('/add', productController.add);

/* GET products listing. */
router.get('/', productController.list);

/* GET products by category */
router.get('/by-category', productController.listByCategory);

module.exports = router;