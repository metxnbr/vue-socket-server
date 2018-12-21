const testController = require('./api/controllers/test')
const secretController = require('./api/controllers/secret')
const registerController = require('./api/controllers/register')

module.exports = (app) => {
  app.get('/test', testController.index)

  app.post('/test', testController.index)
  
  app.get('/secret', app.oauth.authenticate(), secretController)
  
  app.post('/register', registerController)
}