const connection = require('../config/database')

module.exports = (sql, values) => new Promise( (resolve, reject) => {
  connection.query(sql, values, (error, results) => {
    if(error) {
      reject(error)
    } else {
      resolve(results)
    }
  })
} )