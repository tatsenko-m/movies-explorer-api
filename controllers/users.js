const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');
const config = require('../constants/config');
const errorMessages = require('../constants/error-messages');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({ ...req.body, password: hash }))
    .then((user) => res.status(201).send(user.toSafeJSON()))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessages.validationFailed));
      } else if (err.code === 11000) {
        next(new ConflictError(errorMessages.nonUniqueEmail));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError(errorMessages.wrongCredentials));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError(errorMessages.wrongCredentials));
          }

          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : config.devSecretKey, { expiresIn: '7d' });

          return res.send({ token });
        });
    })
    .catch(next);
};

const getCurrentUserInfo = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(errorMessages.userNotFound));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorMessages.invalidId));
      } else {
        next(err);
      }
    });
};

const updateUserInfo = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;

  if (!name && !email) {
    next(new BadRequestError(errorMessages.validationFailed));
  }

  return User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return next(new NotFoundError(errorMessages.userNotFound));
      }
      return res.status(200).send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessages.validationFailed));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUserInfo,
  updateUserInfo,
};
