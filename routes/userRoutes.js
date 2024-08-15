const express = require('express');
const { registerUser, loginUser, registerGuestUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/registerGuest', registerGuestUser);
router.post('/login', loginUser);

module.exports = router;
