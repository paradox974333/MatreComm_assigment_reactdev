const rateLimit = require('express-rate-limit');


const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'You have submitted too many reviews recently. Please try again later.',
  keyGenerator: (req) => req.user._id.toString(), 
  standardHeaders: true, 
  legacyHeaders: false, 
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 10, 
  message: 'Too many accounts created from this IP, please try again after an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { reviewLimiter, registerLimiter };