const express = require('express');
const http = require('http');
const ws = require('ws');

const app = express();

app.use(express.static('public'));

const server = http.createServer(app);
// const wss = new ws.Server({server});
const wss = new ws.Server({server: server});

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === ws.OPEN) {
      client.send(data);
    }
  });
}

wss.on('connection', (socket) => {

  socket.on('message', (data) => {
    broadcast(data);
  });

});

server.listen(8081, function listening() {
  console.log('Listening on %d', server.address().port);
});