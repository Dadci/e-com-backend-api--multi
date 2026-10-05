const Cart = require('../models/cartModel');
const Product = require('../models/productModel');



// add to cart (create a new cart if not exists otherwise update the cart)

const addToCart = async (userId, productId, variantId, quantity) => {

    // validate the quantity

    if (!Number.isInteger(quantity) || quantity < 1) {

        throw new Error('Quantity must a positive integer');
    }

    // validate the product and variant id

    if (!productId || typeof variantId !== 'string' || !variantId) {
        throw new Error('Product ID and variant ID are required');
    }
    // verify if the product exists

    const product = await Product.findById(productId);

    if (!product) {

        throw new Error('Product not found');
    }


    // verify if the variant exists
    const selectedVariant = product.variants.find(variant =>
        variant._id.toString() === variantId)

    if (!selectedVariant) {
        throw new Error('Variant not found in the product');
    }

    // Get or create the cart

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = new Cart({ user: userId, items: [] }); // create a new cart if not exists

    }


    // check if the product already exists in the cart

    const itemIndex = cart.items.find(item =>
        item.product.toString() === productId.toString() &&
        item.variantId?.toString() === selectedVariant._id.toString());  // find the index of the product in the cart with the same variant

    let newQuantity = quantity;

    if (itemIndex) {
        newQuantity += itemIndex.quantity;
    };

    if (newQuantity > selectedVariant.stock) {
        throw new Error('Stock is not available');
    };


    if (itemIndex) {

        itemIndex.quantity = newQuantity;

        // update or add the quantity of the product in the cart
    } else {

        cart.items.push({
            product: productId,
            quantity: newQuantity,
            variantId: selectedVariant._id
        }); // add new product to the cart
    }

    await cart.save(); // save the cart
    return await Cart.findOne({ user: userId }).populate('items.product'); // return the cart with the products
}


// Get current user's cart

const getCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] }); // create a new cart if not exists
    }
    return cart;
}

//Update the cart 

const updateCart = async (userId, productId, variantId, quantity) => {

    if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error('Quantity must a positive integer');
    }

    // validate the product and variant id

    if (
        typeof productId !== "string" || !productId ||
        typeof variantId !== "string" || !variantId
    ) {
        throw new Error('Product ID and variant ID are required');
    }

    // verify if the product exists

    const product = await Product.findById(productId);

    if (!product) {
        throw new Error('Product not found');
    }

    // verify if the variant exists

    const selectedVariant = product.variants.find(variant =>
        variant._id.toString() === variantId
    )

    if (!selectedVariant) {
        throw new Error('Variant not found in the product');
    }

    // get the cart


    const cart = await Cart.findOne({ user: userId })

    if (!cart) {
        throw new Error('Cart not found');
    }

    // verify if the product and variant exists in the cart

    const existingItem = cart.items.find(item =>
        item.product.toString() === productId.toString() &&
        item.variantId?.toString() === selectedVariant._id.toString());

    if (!existingItem) {
        throw new Error('Selected variant is not in your cart');
    }

    // verify if the quantity is greater than the stock

    if (quantity > selectedVariant.stock) {
        throw new Error('Requested quantity exceeds available stock');
    };

    existingItem.quantity = quantity;

    // save the cart

    await cart.save();

    return await Cart.findOne({ user: userId }).populate('items.product');
}

//Remove product from the cart

const removeFromCart = async (userId, productId, variantId) => {

    if (
        typeof productId !== "string" || !productId ||
        typeof variantId !== "string" || !variantId
    ) {
        throw new Error('Product ID and variant ID are required');
    };

    const cart = await Cart.findOne({ user: userId })

    if (!cart) {
        throw new Error('Cart not found');
    }

    const itemIndex = cart.items.findIndex(item => 
        item.product.toString() === productId.toString() &&
        item.variantId?.toString() === variantId.toString()
    );


    if (itemIndex === -1) {
        throw new Error('Product not found in the cart');
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    return await Cart.findOne({ user: userId }).populate('items.product');
}


module.exports = {
    addToCart,
    getCart,
    updateCart,
    removeFromCart,
}
