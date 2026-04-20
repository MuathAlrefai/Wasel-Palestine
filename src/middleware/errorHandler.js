module.exports = function errorHandler(err, req, res, next) {
  console.error(err);

  return res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || "Internal server error",
      details: err.details || null,
    },
    timestamp: new Date().toISOString(),
  });
};
