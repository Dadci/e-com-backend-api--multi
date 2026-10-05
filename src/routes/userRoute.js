const express = require('express');


const router = express.Router();

const { getProfile, updateProfile } = require('../controllers/userController');

const authMiddleware = require('../middlewares/authMiddleware');
const adminCheck = require('../middlewares/adminMiddleware');


router.get('/profile', authMiddleware, adminCheck('admin'), getProfile);
router.put('/profile', authMiddleware, adminCheck('admin'), updateProfile);

module.exports = router;