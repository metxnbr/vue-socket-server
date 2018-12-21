const bcrypt = require('bcrypt');
const my = require('../../utils/my');

const saltRounds = 10;

// return promise
const hash = (password) => bcrypt.hash(password, saltRounds)

module.exports = {
  create: async (username, password) => {
    const value = {
      username,
      password: await hash(password),
    }

    return await my('INSERT INTO user SET ?', value)
  },

  findById: async (id) => {
    const columns = ['username']

    const results = await my('SELECT ?? FROM user WHERE id = ?', [columns, id])

    return results[0]
  }
}