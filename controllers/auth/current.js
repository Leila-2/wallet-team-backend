const current = async (req, res) => {
  const { email, avatarURL, token, name } = req.user;

  res.json({ email, avatarURL, token, name });
};

module.exports = current;
