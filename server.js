const io = require('socket.io')();
const connection = require('./connection')

io.on('connection', client => { 
  const { id } = client

  client.on('chat list', () => {
    connection.query('SELECT * FROM `chat`',(error, results) => {
      client.emit('chat list', results)
    } );
  } )
  
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
        client.emit('chat message', {
          status: 'success',
          results, 
        })
      } )
    } )
  });

  client.on('disconnect', () => {

  });
});

io.listen(3000);