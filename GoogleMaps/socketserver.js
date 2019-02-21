const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', function(socket){
  
  console.log('user connected');
  socket.on('nick', msg => socket.broadcast.emit('message', {content: msg + ' connected'}))

 
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('message', function(msg) {
    console.log('message: ' + msg);
    io.emit('message', msg);
  });

  socket.on('position', function(obj) {
    socket.broadcast.emit('position', obj);
    console.log(obj)
  })
});

http.listen(3333, function(){
  console.log('listening on *:3333');
});