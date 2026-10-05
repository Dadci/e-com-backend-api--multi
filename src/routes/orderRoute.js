const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const adminCheck = require('../middlewares/adminMiddleware');
const router = express.Router();

const { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder } = require('../controllers/orderController');


// Admin Routes 

router.get('/admin/orders', authMiddleware, adminCheck('admin'), getAllOrders);
router.get('/admin/order/:id', authMiddleware, adminCheck('admin'), getOrderById);
router.put('/admin/order/:id', authMiddleware, adminCheck('admin'), updateOrder);
router.delete('/admin/order/:id', authMiddleware, adminCheck('admin'), deleteOrder);


// User Routes 

router.post('/create-order', createOrder);




module.exports = router;