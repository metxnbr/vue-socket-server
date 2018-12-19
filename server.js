const app = require('express')();
const OAuthServer = require('express-oauth-server');
const bodyParser = require('body-parser')

const server = require('http').createServer(app);

const io = require('socket.io')(server);

const bcrypt = require('bcrypt');

const connection = require('./connection')

app.oauth = new OAuthServer({
  model: require('./model'),
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});


app.get('/', function (req, res) {
  connection.query('SELECT * FROM `chat`', (error, results) => {
    if (error) {
      res.json({
        status: 'error',
        message: error,
      })
    };
    res.json({
      status: 'success',
      results
    })
  })
})

app.post('/register', (req, res) => {
  const { username, password } = req.body
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds).then( hash => {
    const value = {
      username,
      password: hash,
    }
    connection.query('INSERT INTO user SET ?', value, (error, results) => {
      res.json({
        status: 'success',
      })
    })
  } );
});

app.post('/oauth/token', app.oauth.token());

// Get secret.
app.get('/secret', app.oauth.authenticate(), function (req, res) {
  // Will require a valid access_token.
  res.send('Secret area');
});

app.get('/test', (req) => {
  console.log('query', req.query)
  console.log('body', req.body)
})

app.post('/test', (req) => {
  console.log('query', req.query)
  console.log('body', req.body)
})

io.on('connection', client => {
  const { id } = client

  client.on('chat message', data => {
    const obj = {
      ...data,
      chat_user: id,
    }
    connection.query('INSERT INTO chat SET ?', obj, (error, results) => {
      if (error) {
        console.log(error);
        return
      };
      const { insertId } = results

      connection.query('SELECT * FROM `chat` WHERE `chat_id` = ?', [insertId], (error, results) => {
        if (error) {
          console.log(error);
          return
        };
        io.sockets.emit('chat message', {
          status: 'success',
          results,
        })
      })
    })
  });

  client.on('disconnect', () => {

  });
});

server.listen(3000);