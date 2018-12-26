const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use('/static', express.static('client'))
app.use('/static2', express.static('controller'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/controller', function(req, res){
  res.sendFile(__dirname + '/controller/index.html');
});


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

io.on('connection', function(socket) {
  socket.on('orientation', function(obj) {
    io.emit('orientation', obj);
    // console.log(obj)
  })
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});