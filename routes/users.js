const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');
const upload = require('../middleware/uploadImages')

router.post('/',upload.any('picture'), user_controller.register_user);
router.post('/login', user_controller.login_user)
module.exports = router;