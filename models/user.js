const { Schema, model } = require('mongoose');
const Joi = require('joi');

const userSchema = Schema(
  {
    password: {
      type: String,
      minlangth: 6,
      maxlangth: 12,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    totalbalance: {
      type: Number,
      default: 0,
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

const usersRegisterValidation = Joi.object({
  password: Joi.string().min(6).max(12).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'ca', 'uk', 'ru', 'org', 'net'] },
    })
    .required(),
});

const validateEmail = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'ca', 'uk', 'ru', 'org', 'net'] },
    })
    .required(),
});

const User = model('user', userSchema);

module.exports = {
  User,
  schems: {
    registet: usersRegisterValidation,
    email: validateEmail,
  },
};
