const orderService = require('../services/orderService');
const { getIO } = require('../config/socket');


// Create an order

const createOrder = async (req, res) => {

    try {

        const { items, userName, shippingAdresse, shippingCity, phoneNumber } = req.body;


        const order = await orderService.createOrder(items, userName, shippingAdresse, shippingCity, phoneNumber);

        try {
            getIO().to('admins').emit('order:created', {
                orderId: order._id.toString(),
                totalAmount: order.totalAmount,
                createdAt: order.createdAt,
            });
        } catch (notificationError) {
            console.error(
                'Order saved, but notification failed:',
                notificationError.message
            );
        }


        res.status(201).json({ order: order, success: true });


    } catch (err) {

        res.status(400).json({ message: err.message });

    }
}


// Get all orders 

const getAllOrders = async (req, res) => {

    try {

        const orders = await orderService.getAllOrders();

        res.status(200).json({ orders: orders, success: true });

    } catch (err) {

        res.status(400).json({ message: err.message });
    }
}


// Get an order by id 

const getOrderById = async (req, res) => {

    try {

        const requestingUser = req.user;

        const orderId = req.params.id;


        const order = await orderService.getOrderById(orderId, requestingUser);

        res.status(200).json({ order: order, success: true });

    } catch (err) {

        res.status(400).json({ message: err.message });
    }
}


// Get my orders (user only)

const getMyOrders = async (req, res) => {

    try {

        const userId = req.user.id;

        const orders = await orderService.getMyOrders(userId);

        res.status(200).json({ orders: orders, success: true });

    } catch (err) {

        res.status(400).json({ message: err.message });
    }
}

// Update an order 


const updateOrder = async (req, res) => {

    try {

        const orderId = req.params.id;

        const orderData = req.body;

        const order = await orderService.updateOrder(orderId, orderData);

        res.status(200).json({ order: order, success: true });

    } catch (err) {

        res.status(400).json({ message: err.message });
    }
}


// Delete an order 

const deleteOrder = async (req, res) => {

    try {

        const orderId = req.params.id;

        const order = await orderService.deleteOrder(orderId);

        res.status(200).json({ order: order, success: true });

    } catch (err) {

        res.status(400).json({ message: err.message });
    }
}



module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    getMyOrders,
    updateOrder,
    deleteOrder
}