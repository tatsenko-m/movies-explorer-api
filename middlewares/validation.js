const { celebrate, Joi } = require('celebrate');
const { regex } = require('../constants/regex');

const validateSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regex),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateCard,
  validateMovieId,
  validateUser,
};
