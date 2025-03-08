const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login/register requests per windowMs
    message: {
        success: false,
        message: 'Too many attempts. Please try again after 15 minutes'
    }
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100 // Limit each IP to 100 requests per windowMs
});

module.exports = { authLimiter, apiLimiter }; 