const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');
const upload = require('../middleware/uploadImages')
const auth = require('../middleware/auth');

router.post('/',upload.any('picture'), user_controller.register_user);
router.post('/login', user_controller.login_user)
router.get('/verifytoken',auth, user_controller.verify_token)
module.exports = router;