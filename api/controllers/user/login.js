module.exports = (res, user) => {
  const { username, password} = user
  const grant_type = 'password'
  const b = {
    grant_type,
    username,
    password
  }
}