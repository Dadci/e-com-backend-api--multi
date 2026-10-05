const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');


let io;

module.exports = {

    init: (httpServer) => {

        const { Server } = require('socket.io');

        io = new Server(httpServer, {
            cors: {
                origin: 'http://localhost:5173',// react frontend URL when I implement it
                methods: ['GET', 'POST'],
                credentials: true,
            }
        });

        io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth?.token;

                if (typeof token !== 'string' || !token) {
                    return next(new Error('Unauthorized'));
                }

                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                const user = await userModel
                    .findById(decoded.id)
                    .select('_id role');

                if (!user || user.role !== 'admin') {
                    return next(new Error('Unauthorized'));
                }

                socket.data.userId = user._id.toString();

                next();
            } catch (error) {
                next(new Error('Unauthorized'));
            }
        });

        return io;
    },

    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized');
        }
        return io;
    },


}
