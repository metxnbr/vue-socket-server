const testController = require('./api/controllers/test')
const secretController = require('./api/controllers/secret')
const signup = require('./api/controllers/user/signup')

module.exports = (app) => {
  app.get('/test', testController.index)

  app.post('/test', testController.index)
  
  app.get('/secret', app.oauth.authenticate(), secretController)
  
  app.post('/register', signup)
}