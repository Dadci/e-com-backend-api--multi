const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');

const authMiddleware = require('../middlewares/authMiddleware');
const adminCheck = require('../middlewares/adminMiddleware');


//public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);


//admin routes
router.post('/', authMiddleware, adminCheck("admin"), createCategory);
router.put('/:id', authMiddleware, adminCheck("admin"), updateCategory);
router.delete('/:id', authMiddleware, adminCheck("admin"), deleteCategory);


module.exports = router;