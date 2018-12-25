const app = require('express')();
const OAuthServer = require('express-oauth-server');
const bodyParser = require('body-parser')

const server = require('http').createServer(app);

const io = require('socket.io')(server);

const router = require('./routes')

app.oauth = new OAuthServer({
  model: require('./model'),
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

router(app);

app.post('/oauth/token', app.oauth.token());

io.on('connection', client => {
  client.on('disconnect', () => {

  });
});

server.listen(3000);