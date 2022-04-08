const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User, schems } = require('../../models/user');

const { SECRET_KEY } = process.env;

const login = async (req, res) => {
  const { error } = schems.registet.validate(req.body);

  if (error) {
    throw new createError(400, error.message);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  const name = user.name;

  const { avatarURL } = user;

  if (!user) {
    throw new createError(401, 'Email or password is wrong');
  }

  const compareResult = await bcrypt.compare(password, user.password);

  if (!compareResult) {
    throw new createError(401, 'Email or password is wrong');
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '5h' });

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    user: {
      token,
      email,
      avatarURL,
      name,
    },
  });
};

module.exports = login;
