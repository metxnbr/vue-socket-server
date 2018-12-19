const bcrypt = require('bcrypt');
const my = require('./my')

const model = {
  getAccessToken: async accessToken => {
    const results = await my('SELECT * FROM oauth_access_token WHERE access_token = ?',
      [accessToken]
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
    const results = await my('SELECT * FROM oauth_client WHERE id = ? AND secret = ?', [clientId, clientSecret])
    result = results[0]
    return {
      ...result,
      grants: ['password'],
    }
  },

  getUser: async (username, password) => {
    const results = await my('SELECT * FROM user WHERE username = ?', [username])
    const result = results[0];
    const passwordHash = result.password
    const match = await bcrypt.compare(password, passwordHash);
    if (match) {
      return result
    }
  },

  saveToken: async (token, client, user) => {
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
  },
}

module.exports = model