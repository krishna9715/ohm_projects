const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: () => uuidv4(),
  },
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
 
  isReferred: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  googleId: {
    type: String,
    default: null,
  },
  accountCreatedAt: {
    type: Date,
    default: Date.now,
  },
  lastLoginTime: {
    type: Date,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isSignedWithGoogle: {
    type: Boolean,
    default: false,
  },
  isLoggedIn: {
    type:Boolean,
    default:false,
  }
});

module.exports = mongoose.model('User', userSchema);
