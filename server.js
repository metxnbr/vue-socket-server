const io = require('socket.io')();
io.on('connection', client => { 
  client.on('event', data => {
    console.log(data);
  });
  client.on('disconnect', () => {});
});
io.listen(3000);