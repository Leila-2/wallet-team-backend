const current = async (req, res) => {
  const { email, avatarURL, token } = req.user;

  res.json({ email, avatarURL, token });
};

module.exports = current;
