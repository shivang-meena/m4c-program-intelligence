
// if any mathing rout not found so  catches 404s
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass to global error handler
};

// 2. vaalidation handler catches mongoose schema errors  400
const validationHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      messages: messages,
    });
  }
  next(err); // If not a validation error, pass it down
};

// 3. global error handler catches server crashes  500
const globalErrorHandler = (err, req, res, next) => {
  // If status code is 200 but we have an error, force it to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    error: err.message,
    // only show stack trace in development, not in production
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  notFoundHandler,
  validationHandler,
  globalErrorHandler,
};