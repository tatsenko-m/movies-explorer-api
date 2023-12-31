const mongoose = require('mongoose');
const validator = require('validator');
const errorMessages = require('../constants/error-messages');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (field) => validator.isEmail(field),
      message: errorMessages.invalidEmail,
    },
  },
  password: {
    type: String,
    select: false,
    requred: true,
  },
});

function toSafeJSON() {
  const user = this.toObject();
  delete user.password;
  return user;
}

userSchema.methods.toSafeJSON = toSafeJSON;

module.exports = mongoose.model('user', userSchema);
