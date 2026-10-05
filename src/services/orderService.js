const mongoose = require('mongoose');
const orderModel = require('../models/orderModel');

const Product = require('../models/productModel');





// Create a new order

const createOrder = async (
    items,
    userName,
    shippingAdresse,
    shippingCity,
    phoneNumber
) => {
    if (!userName || !shippingAdresse || !shippingCity || !phoneNumber) {
        throw new Error('All fields are required');
    }

    if (typeof phoneNumber !== 'string' || !/^\d{10}$/.test(phoneNumber)) {
        throw new Error('Phone number must contain exactly 10 digits');
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
        throw new Error('An order must contain between 1 and 50 items');
    }

    return mongoose.connection.transaction(async (session) => {
        // Read this customer's cart inside the transaction.
        
        

        const orderItems = [];

        // Process one cart item at a time.
        for (const item of items) {
            
            if (
                !item ||
                !mongoose.isObjectIdOrHexString(item.productId) ||
                !mongoose.isObjectIdOrHexString(item.variantId)
            ) {
                throw new Error('Each item needs a valid productId and variantId');
            }

            if (!Number.isInteger(item.quantity) || item.quantity < 1) {
                throw new Error('Order item quantity must be a positive integer');
            }

            // Here item.product is an ID, because we did not populate the cart.
            const product = await Product.findById(item.productId)
                .session(session);

            if (!product) {
                throw new Error('A product in your order is no longer available');
            }

            const selectedVariant = product.variants.find(variant =>
                variant._id.toString() === item.variantId.toString()
            );

            if (!selectedVariant) {
                throw new Error(
                    `Selected variant of ${product.name} is no longer available`
                );
            }

            if (item.quantity > selectedVariant.stock) {
                throw new Error(`Not enough stock for ${product.name}`);
            }

            // Deduct only from the variant being purchased.
            selectedVariant.stock -= item.quantity;

            // Variants are embedded in the product, so save their parent.
            await product.save({ session });

            // Preserve the purchased details in the order.
            orderItems.push({
                product: product._id,
                variantId: selectedVariant._id,
                name: product.name,
                sku: selectedVariant.sku,
                attributes: selectedVariant.attributes.map(attribute => ({
                    name: attribute.name,
                    value: attribute.value,
                })),
                price: selectedVariant.price,
                quantity: item.quantity,
            });
        }

        const totalAmount = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const order = new orderModel({
            userName,
            shippingAdresse,
            shippingCity,
            phoneNumber,
            items: orderItems,
            totalAmount,
            status: 'pending',
            paymentStatus: 'unpaid',
        });

        await order.save({ session });


        return order;
    });
};


// Get all orders

const getAllOrders = async () => {

    const orders = await orderModel.find().populate('user', 'email').populate('items.product').sort({ createdAt: -1 });

    return orders;
}


// Get an order by id

const getOrderById = async (id, requestingUser) => {


    const order = await orderModel.findById(id).populate('items.product')

    if (!order) {
        throw new Error('order not found');
    }

    const isOwner = order.user?.toString() === requestingUser.id.toString();

    const isAdmin = requestingUser.role === 'admin';

    if (!isOwner && !isAdmin) {

        throw new Error('You are not authorized to access this order');
    }


    return order;
}

//Get orders by user id (user can only see his own orders)

const getMyOrders = async (userId) => {
    const orders = await orderModel.find({ user: userId }).populate('items.product').sort({ createdAt: -1 });


    return orders;
}


// Change the stock of a variant
const changeVariantStock = async (
    productId,
    variantId,
    quantityChange,
    session
) => {
    const product = await Product.findById(productId)
        .session(session);

    if (!product) {
        throw new Error('Cannot adjust stock: product no longer exists');
    }

    const variant = product.variants.find(variant =>
        variant._id.toString() === variantId.toString()
    );

    if (!variant) {
        throw new Error('Cannot adjust stock: variant no longer exists');
    }

    const newStock = variant.stock + quantityChange;

    if (newStock < 0) {
        throw new Error(`Not enough stock for ${product.name}`);
    }

    variant.stock = newStock;
    await product.save({ session });
};


// Update an order 

const updateOrder = async (id, data) => {
    if (
        !data ||
        typeof data !== 'object' ||
        Array.isArray(data) ||
        Object.keys(data).length === 0
    ) {
        throw new Error('Update data is required');
    }

    return mongoose.connection.transaction(async (session) => {
        const order = await orderModel.findById(id)
            .session(session);

        if (!order) {
            throw new Error('Order not found');
        }

        // Remember the stock quantities before applying the edit.
        const previousStatus = order.status;

        const previousItems = order.items.map(item => ({
            product: item.product,
            variantId: item.variantId,
            quantity: item.quantity,
        }));

        // Apply the admin's edits to the document in memory.
        order.set(data);

        if (!order.items || order.items.length === 0) {
            throw new Error('An order must contain at least one item');
        }

        // Calculate the total using the order's saved item prices.
        order.totalAmount = order.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        // Check the edited document before adjusting stock.
        await order.validate();

        const wasCancelled = previousStatus === 'cancelled';
        const isCancelled = order.status === 'cancelled';

        const inventoryChanged =
            order.isModified('items') ||
            wasCancelled !== isCancelled;

        if (inventoryChanged) {
            // Shipped goods need a returns process, not instant restocking.
            if (['shipped', 'delivered'].includes(previousStatus)) {
                throw new Error(
                    'Stock-changing edits after shipment need a returns process'
                );
            }

            // Reverse the previous deduction, if there was one.
            if (!wasCancelled) {
                for (const item of previousItems) {
                    await changeVariantStock(
                        item.product,
                        item.variantId,
                        item.quantity,
                        session
                    );
                }
            }

            // Apply the updated deduction, unless the order is cancelled.
            if (!isCancelled) {
                for (const item of order.items) {
                    await changeVariantStock(
                        item.product,
                        item.variantId,
                        -item.quantity,
                        session
                    );
                }
            }
        }

        await order.save({ session });

        return order;
    });
};


// Delete an order

const deleteOrder = async (id) => {
    const order = await orderModel.findOneAndDelete({
        _id: id,
        status: 'cancelled',
        paymentStatus: 'unpaid'
    });


    if (!order) {
        throw new Error('Order not found or not cancelled');
    }


    return order;
}


module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    getMyOrders,
    updateOrder,
    deleteOrder,
}


