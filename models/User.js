const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    mxLength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    maxLength: 50,
  },
  lastName: {
    type: String,
    maxLength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokeExp: {
    type: Number,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
