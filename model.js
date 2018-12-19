const my = require('./my')

/**
 * Get client.
 */

module.exports.getClient = function *(clientId, clientSecret) {
  console.log('getClient');
  return my('SELECT * FROM oauth_client WHERE id = ? AND secret = ?', [clientId, clientSecret])
  .then( results => {
    const result = results[0]
    return {
      ...result,
      grants: ['password'],
    }
  } )
  
};

/*
 * Get user.
 */

module.exports.getUser = function *(username, password) {
  console.log('getUser');

  return my('SELECT * FROM user WHERE username = ? AND password = ?', [username, password])
  .then( results => {
    return results[0]
  } )
};

/**
 * Save token.
 */

module.exports.saveToken = function *(token, client, user) {
  console.log('saveAccessToken');

  console.log('token', token);
  console.log('client', client);
  console.log('user', user);
  

  const {
    accessToken,
    refreshToken,
  } = token

  const obj = {
    access_token: accessToken,
    client_id: client.id,
    user_id: user.id,
    refresh_token: refreshToken,
  }

  return my('INSERT INTO oauth_access_token SET ?', obj)
  .then( (results) => {
    console.log(results);
    
    return {
      client: client.id,
      user : user.id,
      accessToken,
    }
  } )

};
