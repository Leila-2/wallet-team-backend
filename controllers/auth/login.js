const CreateError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User, schems } = require("../../models/user");

const { SECRET_KEY } = process.env;

const login = async (req, res) => {
  const { error } = schems.registet.validate(req.body);

  if (error) {
    throw new CreateError(400, error.message);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  const { avatarURL, name } = user;

  if (!user) {
    throw new CreateError(401, "Email or password is wrong");
  }

  const compareResult = await bcrypt.compare(password, user.password);

  if (!compareResult) {
    throw new CreateError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "5h" });

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
