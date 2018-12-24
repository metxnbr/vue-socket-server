const User = require('../../models/User');

module.exports = async (req, res) => {
  const { username, password } = req.body

  try {
    // verify
    if (username.length === 0) throw { type: 'custom', message: 'We need to know your username!' }
    if (username.length < 3) throw { type: 'custom', message: 'username no less than 3' }
    if (username.length > 12) throw { type: 'custom', message: 'username no more than 12' }

    if (password.length === 0) throw { type: 'custom', message: 'please set your password' }
    if (password.length < 6) throw { type: 'custom', message: 'password no less than 6' }
    if (password.length > 16) throw { type: 'custom', message: 'password no more than 16' }

    const {create, findById} = User
    
    try {
      const results = await create(username, password);
      const { insertId } = results
      await findById(insertId)
      res.redirect(307, '/oauth/token');
    } catch (error) {
      
    }
   
  } catch (error) {
    const { errno, type, message } = error

    if (type === 'custom') {
      res.json({
        status: 'error',
        message,
      })
      return
    }

    if (errno === 1062) {
      res.json({
        status: 'error',
        message: 'username already exsit',
      })
      return
    }

    res.json({
      status: 'error',
      message: 'fail to register',
    })

  }
}