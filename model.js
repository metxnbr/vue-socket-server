const bcrypt = require('bcrypt');
const jwt = require('./utils/jwt');
const asyncConnect = require('./utils/asyncConnect')

const model = {
  getAccessToken: async accessToken => {
    console.log('getAccessToken');

    const jwtDecoded = await jwt.verify(accessToken)
    const results = await asyncConnect('SELECT * FROM oauth_access_token WHERE access_token = ?',
      [jwtDecoded.access_token]
    )
    const result = results[0];
    return {
      accessToken: result.access_token,
      accessTokenExpiresAt: result.expires_at,
      client: { id: result.client_id },
      user: { id: result.user_id },
    }
  },

  getClient: async (clientId, clientSecret) => {
    console.log('getClient');

    const results = await asyncConnect('SELECT * FROM oauth_client WHERE id = ? AND secret = ?', [clientId, clientSecret])
    result = results[0]
    return {
      ...result,
      grants: ['password', 'refresh_token'],
    }
  },

  getRefreshToken: async (refreshToken) => {
    console.log('getRefreshToken');
    const jwtDecoded = await jwt.verify(refreshToken)
    const results = await asyncConnect('SELECT * FROM oauth_refresh_token WHERE refresh_token = ?', [jwtDecoded.refresh_token])
    result = results[0]
    return {
      refreshToken: result.refresh_token,
      refreshTokenExpiresAt: result.expires_at,
      client: { id: result.client_id },
      user: { id: result.user_id },
    }
  },

  revokeToken: async (token) => {
    console.log('revokeToken');
    try {
      const results = await asyncConnect('DELETE FROM oauth_refresh_token WHERE refresh_token = ?', [token.refreshToken])
      return true
    } catch (error) {
      return false
    }

  },

  getUser: async (username, password) => {
    console.log('getUser');

    const results = await asyncConnect('SELECT * FROM user WHERE username = ?', [username])
    const result = results[0];
    const passwordHash = result.password
    const match = await bcrypt.compare(password, passwordHash);
    if (match) {
      return result
    }
  },

  saveToken: async (token, client, user) => {
    console.log('saveToken');

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

    try {
      await asyncConnect('INSERT INTO oauth_access_token SET ?', saveAccessToken)
      await asyncConnect('INSERT INTO oauth_refresh_token SET ?', saveRefreshToken)
      const jwtAccessToken = await jwt.sign({ access_token: accessToken });
      const jwtRefreshToken = await jwt.sign({ refresh_token: refreshToken });
      return {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
        client: { id: client.id },
        user: { id: user.id }
      }
    } catch (error) {
      console.log(error);

    }
  },
}

module.exports = model