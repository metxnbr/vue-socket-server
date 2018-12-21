const bcrypt = require('bcrypt');
const my = require('../../utils/my');

module.exports = async (req, res) => {
  const { username, password } = req.body
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