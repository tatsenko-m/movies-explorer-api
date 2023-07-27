const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const config = require('../constants/config');
const errorMessages = require('../constants/error-messages');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(errorMessages.invalidToken);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : config.devSecretKey);
  } catch (err) {
    res.status(401);
    return next(new UnauthorizedError(errorMessages.invalidToken));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
