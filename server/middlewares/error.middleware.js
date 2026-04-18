const errorHandler = (err, _, res, __) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Server error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { errorHandler };
