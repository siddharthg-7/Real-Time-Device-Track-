const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.render('index');
});
io.on('connection', (socket) => {
    socket.on('send-location', function (data) {
        io.emit('receive-location', {id: socket.id,...data});
    });
    console.log('a user connected');
});

server.listen(3000);
