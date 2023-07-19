const mongoose = require('mongoose');
const validator = require('validator');

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
      message: 'Некорректный формат почты',
    },
  },
  password: {
    type: String,
    select: false,
    requred: true,
  },
});

// eslint-disable-next-line func-names
userSchema.methods.toSafeJSON = function () {
  const user = this.toObject();
  delete user.password;

  return user;
};

module.exports = mongoose.model('user', userSchema);
