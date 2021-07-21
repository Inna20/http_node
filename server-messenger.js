const io = require('socket.io');
const http = require('http');
const fs = require("fs");
const path = require("path");
const url = require("url");

// Создаем http сервер как на прошлом уроке и сохраняем его в констатну
const app = http.createServer((request, response) => {
    if (request.method === 'GET') {
        const filePath = path.join(__dirname, 'index.html');
    
        readStream = fs.createReadStream(filePath);   
        readStream.pipe(response);
      } else {
          response.statusCode = 405;
          response.end();
      }    
});

// New проинициализировать точку доступа сокета, описать первые сообщения для подключившихся клиентов и запустить сервер.
const socketApp = io(app);
let counter = 0;

socketApp.on('connection', function (socket) {
  counter++;

  let name = 'Client ' + counter;
  console.log('New connection - ' + name);

  // Всем кроме текущего
  // socket.broadcast.emit('NEW_CONN_EVENT', { msg: 'The new client connected - ' + name, count: counter });
  
  // Отправит всем и текущему!!!
  socketApp.emit('NEW_CONN_EVENT', { msg: 'The new client connected - ' + name, count: counter });


  socket.on('CLIENT_MSG', (data) => {

    socket.broadcast.emit('SERVER_MSG', { msg: data.msg.split('').reverse().join('')});
  });

  socket.on('disconnect', function () {
    counter--;

    console.log('Disconnested ' + name);
    socket.broadcast.emit('DISCONN_EVENT', { msg: 'The ' + name + ' disconnected', count: counter });
  });
});

app.listen(3000, 'localhost');