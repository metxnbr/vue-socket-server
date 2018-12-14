const io = require('socket.io')();

const jsonfile = require('jsonfile')

const file = './chat.json'

let chats = []

io.on('connection', client => { 
  client.on('chat message', data => {
    chats.push({message: data})
    jsonfile.writeFile(file, chats)
    .then(res => {
      client.emit('send status', {status: 'success'})
    })
    .catch(() => {
      client.emit('send status', {status: 'error'})
    })
  });
  client.on('disconnect', () => {

  });
});

io.listen(3000);