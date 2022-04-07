const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

const { User, schems } = require('../../models/user');

const signup = async (req, res) => {
  const { error } = schems.registet.validate(req.body);

  if (error) {
    throw new createError(400, error.message);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new createError(409, 'Email in use');
  }

  const solt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, solt);
  const avatarURL = gravatar.url(
    email,
    { s: '100', r: 'x', d: 'monsterid' },
    true
  );

  await User.create({
    email,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email,
    },
  });
};

module.exports = signup;
