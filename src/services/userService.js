const userModel = require('../models/userModel');



const getProfile = async (userId) => {

    const user = await userModel.findById(userId).select('-password');

    if (!user) {
        throw new Error('User not found');
    }

    return user;

}


const updateProfile = async (userId, data) => {

    const { name, email } = data;

    const user = await userModel.findByIdAndUpdate(
        userId,
        { name, email },
        { returnDocument: 'after', runValidators: true }
    ).select('-password');

    if (!user) {
        throw new Error('User not found');
    }

    return user;
}

module.exports = { getProfile, updateProfile }

