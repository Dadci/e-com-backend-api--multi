const userService = require('../services/authService');




/*const registerUser = async (req, res) => {

    try {
        const register = await userService.registerUser(req.body);
        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}*/


const loginUser = async (req, res) => {
    try {
        const login = await userService.loginUser(req.body);
        res.status(200).json({ message: 'Login successful', token: login.token, user: login.user });

    } catch (err) {
        res.status(400).json({ message: err.message });

    }
}




module.exports = { loginUser }


