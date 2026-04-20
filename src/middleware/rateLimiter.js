const rateLimit = require("express-rate-limit");

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Too many auth requests",
      details: null,
    },
    timestamp: new Date().toISOString(),
  },
});

exports.reportLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.REPORT_RATE_LIMIT_MAX) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Too many report submissions",
      details: null,
    },
    timestamp: new Date().toISOString(),
  },
});
