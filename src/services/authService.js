const userModel = require('../models/userModel');
const { sendEmail } = require('./emailService');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();



const registerUser = async (data) => {

    const { name, email, password } = data;
    if (!name || !email || !password) {
        throw new Error('All fields are required');

    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }

    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        name,
        email,
        password: hashedPassword,

    })

    const userResponse = user.toObject();
    delete userResponse.password;

    return {

        message: 'User registered successfully',
        user: userResponse,

    }
}


const loginUser = async (data) => {
    const { email, password } = data;
    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
        throw new Error('All fields are required');
    }

    const user = await userModel.findOne({ email })
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch || user.role !== 'admin') {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    },
        process.env.JWT_SECRET,
        { expiresIn: '1d' },

    )

    const userResponse = user.toObject();
    delete userResponse.password;

    return {

        message: 'Login successful',
        token,
        user: userResponse,
    }

}

module.exports = { registerUser, loginUser }