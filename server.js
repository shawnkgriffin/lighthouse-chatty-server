const uuidv4 = require('uuid/v4');
const express = require('express');
const http = require('http');
const ws = require('ws');

const app = express();

app.use(express.static('public'));

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// const wss = new ws.Server({server});
const wss = new ws.Server({server: server});

function broadcast(data) {
  wss.clients.forEach((client) => {

    if (client.readyState === ws.OPEN) {
      console.log('broadcast', data);
      client.send(data);
    }
  });
}

/**
* FUNCTION 
* Take in a JSON encoded message from someone, parse it, add a UUID and return it as a message.
* @function getUsers
* @param {string} data - JSON encoded string from a user. contains username, content.
* @param {function} callback 
* @returns {object} Users = array of Users
*/

function buildMessage(data) {
  message = JSON.parse(data);
  message.id = uuidv4();
  console.log('buildMessage', message)
  return message;
}

wss.on('connection', (socket) => {
  console.log('connection');
  socket.on('message', (data) => {
    console.log('message',data);
    const message = buildMessage(data);
    broadcast(JSON.stringify(message));
  });
});
