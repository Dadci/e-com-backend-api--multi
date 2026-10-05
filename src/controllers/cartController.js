const cartService = require('../services/cartService');



// Add product to the cart 

const addToCart = async (req, res) => {

    try {

        const userId = req.user.id;
        const { productId, variantId, quantity } = req.body;

        const cart = await cartService.addToCart(
            userId,
            productId,
            variantId,
            quantity);

        res.status(200).json({ message: 'Product added to the cart', cart });

    } catch (err) {

        res.status(400).json({ message: 'Failed to add product to the cart', error: err.message });
    }
}


// Get current user's cart 

const getCart = async (req, res) => {

    try {

        const userId = req.user.id;

        const cart = await cartService.getCart(userId);

        res.status(200).json({ message: 'Cart retrieved successfully', cart });

    } catch (err) {
        res.status(400).json({ message: 'Failed to get cart', error: err.message });

    }
}

// Update the cart 

const updateCart = async (req, res) => {

    try {

        const userId = req.user.id;
        const { productId, variantId, quantity } = req.body;

        const cart = await cartService.updateCart(
            userId,
            productId,
            variantId,
            quantity);

        res.status(200).json({ message: 'Cart updated successfully', cart });

    } catch (err) {
        res.status(400).json({ message: 'Failed to update cart', error: err.message });

    }
}


// Remove product from the cart 

const removeFromCart = async (req, res) => {

    try {

        const userId = req.user.id;
        const { productId, variantId } = req.params;

        const cart = await cartService.removeFromCart(userId, productId, variantId);

        res.status(200).json({ message: 'Product removed from the cart', cart });
    } catch (err) {
        res.status(400).json({ message: 'Failed to remove product from the cart', error: err.message });
    }
}



module.exports = {
    addToCart,
    getCart,
    updateCart,
    removeFromCart,
}