const my = require('./my')

module.exports.getAccessToken = function *(accessToken) {
  console.log('getAccessToken');

  return my('SELECT * FROM oauth_access_token WHERE access_token = ?',
            [accessToken]
  ).then( results => {
    const result = results[0];
    return {
      accessToken: result.access_token,
      accessTokenExpiresAt: result.expires_at,
      client: { id: result.client_id },
      user: { id: result.user_id },
    }
  } )
  
}

/**
 * Get client.
 */

module.exports.getClient = async(clientId, clientSecret) => {
  console.log('getClient');
  const results = await my('SELECT * FROM oauth_client WHERE id = ? AND secret = ?', [clientId, clientSecret])
  result = results[0]
  return {
    ...result,
    grants: ['password'],
  }
  
};

/*
 * Get user.
 */

module.exports.getUser = async(username, password) => {
  console.log('getUser');

  const results= await my('SELECT * FROM user WHERE username = ? AND password = ?', [username, password])
  return results[0]
};

/**
 * Save token.
 */

module.exports.saveToken = async(token, client, user) => {
  console.log('saveAccessToken');

  console.log('token', token);
  console.log('client', client);
  console.log('user', user);
  

  const {
    accessToken,
    accessTokenExpiresAt,

    refreshToken,
    refreshTokenExpiresAt,
  } = token

  const saveAccessToken = {
    access_token: accessToken,
    expires_at: accessTokenExpiresAt,
    client_id: client.id,
    user_id: user.id,
  }

  const saveRefreshToken = {
    refresh_token: refreshToken,
    expires_at: refreshTokenExpiresAt,
    client_id: client.id,
    user_id: user.id,
  }

  const accessResults = await my('INSERT INTO oauth_access_token SET ?', saveAccessToken)
  const refreshResults = await my('INSERT INTO oauth_refresh_token SET ?', saveRefreshToken)

  return {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt,
    client: { id: client.id },
    user: { id: user.id }
  }
};
