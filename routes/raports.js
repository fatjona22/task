const express = require('express');
const router = express.Router();
const raport_controller = require('../controllers/raportController')
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
router.post('/', [auth,admin], raport_controller.get_raport);
module.exports = router;
