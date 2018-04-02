let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let os = require('os');
let ip = '';

Object.keys(os.networkInterfaces()).forEach(function (ifname) {
  os.networkInterfaces()[ifname].forEach(function (iface) {
    if ('IPv4' == iface.family && iface.internal == false)
      console.log(ifname, iface.address);
  });
});

let port = process.env.PORT || 3001;
console.log('Using Port', port);

io.on('connection', (socket) => {
  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.nickname, event: 'left'});   
  });
 
  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    io.emit('users-changed', {user: nickname, event: 'joined'});    
  });
  
  socket.on('add-message', (message) => {
    io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});    
  });
});

var app = express();
app.get('/', function (req, res) {
  res.send('Hello World!');
});

http.listen(9999, function(){});