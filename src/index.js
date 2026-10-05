const express = require('express');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();

const port = 3000;


const socketConfig = require('./config/socket');
const path = require('path');
const uploadErrorMiddleware = require('./middlewares/uploadErrorMiddleware');
const { generalLimiter } = require('./middlewares/rateLimiter');


const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/categoryRoute');
const productRoute = require('./routes/productRoute');
//const cartRoute = require('./routes/cartRoute');
const orderRoute = require('./routes/orderRoute');


const connectDB = require('./config/dbConnect');

const app = express();

app.use(cors());
app.use(express.json());


// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketConfig.init(server);


// Socket.io connection event

io.on('connection', (socket) => {
    socket.join('admins');

    console.log(`Admin connected: ${socket.data.userId}`);

    socket.on('disconnect', () => {
        console.log(`Admin disconnected: ${socket.data.userId}`);
    });
});




app.use('/api', generalLimiter);

// Connect to the database
connectDB();


// Auth routes
app.use('/api/auth', authRoute)

// User routes
app.use('/api/users', userRoute);


// Category routes
app.use('/api/categories', categoryRoute);

//Product routes
app.use('/api/products', productRoute);

// Static files uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cart routes
//app.use('/api/cart', cartRoute);


//order routes

app.use('/api/orders', orderRoute);


// Multer error handler
app.use(uploadErrorMiddleware);



// Start the server

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

