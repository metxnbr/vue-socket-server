const app = require('express')();
const bodyParser = require('body-parser')

const server = require('http').createServer(app);

const io = require('socket.io')(server);

const connection = require('./connection')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});


app.get('/', function (req, res) {
  connection.query('SELECT * FROM `chat`', (error, results)=> {
    if (error) {
      console.log(error);
      return
    };
    res.json(results)
  } )
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

      connection.query('SELECT * FROM `chat` WHERE `chat_id` = ?', [insertId], (error, results)=> {
        if (error) {
          console.log(error);
          return
        };
        io.sockets.emit('chat message', {
          status: 'success',
          results, 
        })
      } )
    } )
  });

  client.on('disconnect', () => {

  });
});

server.listen(3000);