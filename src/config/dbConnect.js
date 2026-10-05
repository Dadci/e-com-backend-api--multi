const { default: mongoose } = require('mongoose');
require('dotenv').config();

mongoose.set('sanitizeFilter', true);

const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to DB')
    } catch (err) {
        console.log("Db error", err)
        process.exit(1);

    }
}

module.exports = connectDB