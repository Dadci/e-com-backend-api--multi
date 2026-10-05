const rateLimit = require('express-rate-limit');



const generalLimiter = rateLimit({

    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
    headers: true,
    standardHeaders: true,
    legacyHeaders: false,

});


const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many requests, please try again later.',
});

module.exports = {

    generalLimiter,
    strictLimiter,
}
