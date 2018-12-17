const io = require('socket.io')();

const jsonfile = require('jsonfile')

const file = './chat.json'

let CHATS = []

io.on('connection', client => { 
  const { id } = client

  client.on('chat list', () => {
    jsonfile.readFile(file)
    .then(obj => {
      CHATS = obj
      client.emit('chat list', {
        status: 'success',
        data: CHATS, 
      })
    })
    .catch(() => {
      client.emit('chat list', {
        status: 'error',
      })
    } )
  } )
  
  client.on('chat message', data => {
    const timemap = Date.now()

    const c = {
      id,
      timemap,
      message: data,
    }

    CHATS.push(c)

    jsonfile.writeFile(file, CHATS)
    .then(res => {
      client.emit('chat message', {
        status: 'success',
        data: c, 
      })
    })
    .catch(() => {
      client.emit('chat message', {status: 'error'})
    })
  });
  client.on('disconnect', () => {

  });
});

io.listen(3000);