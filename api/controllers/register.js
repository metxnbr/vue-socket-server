const bcrypt = require('bcrypt');

module.exports = (req, res) => {
  const { username, password } = req.body
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds).then(hash => {
    const value = {
      username,
      password: hash,
    }
    connection.query('INSERT INTO user SET ?', value, (error, results) => {
      if (error) {
        res.json({
          status: 'error',
          message: error,
        })
      }
      res.json({
        status: 'success',
      })
    })
  });
}