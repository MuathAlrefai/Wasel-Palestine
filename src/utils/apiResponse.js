exports.success = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data });
};

exports.error = (res, message = 'Something went wrong', statusCode = 500, details = null) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      details
    },
    timestamp: new Date().toISOString()
  });
};
