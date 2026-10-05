const express = require('express');

const router = express.Router();

const { loginUser } = require('../controllers/authController');


const { strictLimiter } = require('../middlewares/rateLimiter');

//router.post('/register', strictLimiter, registerUser);
router.post('/login', strictLimiter, loginUser);

module.exports = router;