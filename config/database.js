const mysql      = require('mysql')
const env      = require('./env/development')

const connection = mysql.createConnection(env.database);

connection.connect( err => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
} );

module.exports = connection