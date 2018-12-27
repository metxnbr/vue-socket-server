const User = require('../../models/User');

module.exports = (req, res) => {
  const { user } = res.locals.oauth.token
  res.json(user)
}