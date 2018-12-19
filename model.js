const my = require('./my')

/*
 * Get access token.
 */

module.exports.getAccessToken = function(bearerToken) {
  
};

/**
 * Get client.
 */

module.exports.getClient = function *(clientId, clientSecret) {
  console.log('getClient');
  return my('SELECT * FROM oauth_clients WHERE id = ? AND secret = ?', [clientId, clientSecret])
  .then( results => {
    const result = results[0]
    return {
      clientId: result.id,
      clientSecret: result.secret,
      grants: ['password'], // the list of OAuth2 grant types that should be allowed
    };
  } )
  
};

/**
 * Get refresh token.
 */

module.exports.getRefreshToken = function *(bearerToken) {
  console.log('getRefreshToken');

};


/*
 * Get user.
 */

module.exports.getUser = function *(username, password) {
  console.log('getUser');

  return my('SELECT * FROM users WHERE email = ? AND password = ?', [username, password])
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
    accessTokenExpiresOn,
    refreshToken,
    refreshTokenExpiresOn,
  } = token

  const obj = {
    id: accessToken,
    client_id: client.id,
    user_id: user.id,
  }

  return my('INSERT INTO oauth_access_tokens SET ?', obj)
  .then( results => {
    return results[0]
  } )

};
