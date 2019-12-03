const express = require('express');
const router = express.Router();
const order_controller = require('../controllers/orderController');
const upload = require('../middleware/uploadImages');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin')


//Make an order by a user as a simple user, not an admin.. 
router.post('/',auth, order_controller.make_order);
//Get all the orders of the current user.. 
router.get('/myorders', auth, order_controller.getMyOrders);
//Cancel an order if it is not confirmed/approved yet 
router.put('/cancelorder/:id',auth, order_controller.cancel_order);
//Get all the orders of all users by admin
router.get('/allorders', [auth,admin],order_controller.get_orders);
//admin approves an order 
router.put('/approveorder/:id', [auth,admin],order_controller.approve_order)

module.exports = router;