const bcrypt = require('bcrypt');
const my = require('../../utils/my');

module.exports = async (req, res) => {
  const { username, password } = req.body

  // verify
  if (username.length === 0) throw 'We need to know your username!'
  if (username.length < 3) throw 'username no less than 3'
  if (username.length > 12) throw 'username no more than 12'

  if (password.length === 0) throw 'please set your password'
  if (password.length < 6) throw 'password no less than 6'
  if (password.length > 16) throw 'password no more than 16'

  const saltRounds = 10;

  try {
    const hash = await bcrypt.hash(password, saltRounds)

    const value = {
      username,
      password: hash,
    }

    const results = await my('INSERT INTO user SET ?', value)

    res.json({
      status: 'success',
    })
  } catch (error) {
    const { errno } = error
    if (errno === 1062) {
      res.json({
        status: 'error',
        message: 'username already exsit',
      })
    }

    res.json({
      status: 'error',
      message: 'fail to register',
    })

  }
}