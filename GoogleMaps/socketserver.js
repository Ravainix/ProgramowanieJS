const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 3333
const connectedSockets = new Map()


io.on('connection', function(socket){
  
  console.log(`[${new Date().toLocaleTimeString()}] User connected ${socket.id}`)
  
  socket.on('player-connect', username => {
    let time = new Date().toLocaleTimeString()
    console.log(`[${time}] New player in chat...`)
    
    socket.broadcast.emit('new-player', username)
    connectedSockets.set(socket.id, username)
  })

 
  socket.on('disconnect', function(){
    let time = new Date().toLocaleTimeString()
    console.log(`[${time}] User disconnected ${socket.id} ...`);
    
    io.emit('delete-player', socket.id)
    io.emit('player-disconnected', connectedSockets.get(socket.id))
    connectedSockets.delete(socket.id)
  });

  socket.on('message', function(msg) {
    let time = new Date().toLocaleTimeString()
    console.log(`[${time}] ${socket.id} send message...`);
    
    io.emit('message', msg);
  });

  socket.on('position', function(obj) {
    socket.broadcast.emit('position', obj);
  })
});

http.listen(port, function(){
  console.log('listening on port ' + port);
});