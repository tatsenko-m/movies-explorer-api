const errorMessages = require('../constants/error-messages');

const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? errorMessages.serverError
        : message,
    });
  next();
};

module.exports = errorHandler;
