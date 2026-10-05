const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const adminCheck = require('../middlewares/adminMiddleware');

const upload = require('../middlewares/uploadMiddleware');


const { newProduct, allProducts, getProduct, updateProduct, deleteProduct, searchByName, updateVariantImage } = require('../controllers/productController');




// Admin routes
router.post('/', authMiddleware, adminCheck("admin"), upload.single('image'), newProduct);
router.put('/:id', authMiddleware, adminCheck("admin"), upload.single('image'), updateProduct);
router.put(
    '/:productId/variants/:variantId/image',
    authMiddleware,
    adminCheck('admin'),
    upload.single('image'),
    updateVariantImage
);
router.delete('/:id', authMiddleware, adminCheck("admin"), deleteProduct);


// Public routes
router.get('/', allProducts);
router.get('/search', searchByName)
router.get('/:id', getProduct);




module.exports = router