const bcrypt = require('bcrypt');
const asyncConnect = require('../../utils/asyncConnect');

const saltRounds = 10;

// return promise
const hash = (password) => bcrypt.hash(password, saltRounds)

module.exports = {
  create: async (username, password) => {
    const value = {
      username,
      password: await hash(password),
    }

    return asyncConnect('INSERT INTO user SET ?', value)
  },

  findById: async (id, columns=['username']) => {
    const results = await asyncConnect('SELECT ?? FROM user WHERE id = ?', [columns, id])

    return results[0]
  }
}