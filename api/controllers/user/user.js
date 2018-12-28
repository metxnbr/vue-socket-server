const User = require('../../models/User');

module.exports = async (req, res) => {
  const { id } = res.locals.oauth.token.user
  const user = await User.findById(id)
  res.json(user)
}