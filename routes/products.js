const express = require('express');
const router = express.Router();
const product_controller = require('../controllers/productController');
const upload = require('../middleware/uploadImages');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', [auth,admin],upload.any('images'), product_controller.createProduct);
router.get('/',auth, product_controller.getProducts);
//add stock to a product from admin 
router.put('/:id', [auth,admin], product_controller.addstock);
router.delete('/:id', [auth,admin],product_controller.delete_product);
module.exports = router;