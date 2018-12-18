const connection = require('./connection')

/**
 * Get client.
 */

module.exports.getClient = function (clientId, clientSecret) {
  connection.query(
    'SELECT client_id, client_secret, redirect_uri FROM oauth_clients WHERE client_id = ? AND client_secret = ?',
    [clientId, clientSecret],
    (error, results, fields) => {
      if (error) {
        return
      }
      const oAuthClient = results[0]
      return {
        clientId: oAuthClient.client_id,
        clientSecret: oAuthClient.client_secret,
        grants: ['password'], // the list of OAuth2 grant types that should be allowed
      };
    })
};

/*
 * Get user.
 */

module.exports.getUser = function (username, password) {
  connection.query('SELECT id FROM user WHERE username = ? AND password = ?', [username, password], (error, results, fields) => {
    if (error) {
      return
    }
    return results[0]
  })
};

/**
 * Save token.
 */

module.exports.saveAccessToken = function (token, client, user) {
  const {
    accessToken,
    accessTokenExpiresOn,
    refreshToken,
    refreshTokenExpiresOn,
  } = token

  const obj = {
    access_token: accessToken,
    access_token_expires_on: accessTokenExpiresOn,
    client_id: client.id,
    refresh_token: refreshToken,
    refresh_token_expires_on: refreshTokenExpiresOn,
    user_id: user.id,
  }

  connection.query('INSERT INTO oauth_tokens SET ?', obj, (error, results, fields) => {
    if (error) {
      return
    }
    return results[0]
  })
};
