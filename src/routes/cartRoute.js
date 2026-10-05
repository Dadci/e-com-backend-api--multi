const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/add-to-cart', authMiddleware, cartController.addToCart);
router.get('/get-cart', authMiddleware, cartController.getCart);
router.put('/update-cart', authMiddleware, cartController.updateCart);
router.delete('/remove-from-cart/:productId/:variantId', authMiddleware, cartController.removeFromCart);



module.exports = router;

