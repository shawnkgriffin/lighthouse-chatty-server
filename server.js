const uuidv4 = require("uuid/v4");
const express = require("express");
const http = require("http");
const ws = require("ws");

const app = express();

app.use(express.static("public"));

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static("public"))
  .listen(PORT, "0.0.0.0", "localhost", () =>
    console.log(`Listening on ${PORT}`)
  );

// const wss = new ws.Server({server});
const wss = new ws.Server({ server: server });

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === ws.OPEN) {
      console.log("broadcast", data);
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
  // parse the incoming message as it's a json string.
  const message = JSON.parse(data);

  //set the outgoing message with a UUID
  message.id = uuidv4();

  //depending on the message, we will change the outgoing message type.
  switch (message.type) {
    case "postMessage":
      message.type = "incomingMessage";
      break;
    case "postNotification":
      message.type = "incomingNotification";
      break;
    default:
      // show an error in the console if the message type is unknown
      throw new Error("Unknown event type " + message.type);
  }

  console.log("buildMessage", message);
  return message;
}
/**
* Broadcast number of users. 
* Get Users returns an array of all the users in system.
* @function broadcastNumberOfUsers()
*/
function broadcastNumberOfUsers() {

  const message = {
    id: uuidv4(),
    type: "numberOfUsers",
    numberOfUsers: wss.clients.size
  };
  broadcast(JSON.stringify(message));
}

/**
* Main loop on getting events. 
* Get Users returns an array of all the users in system.
*/

wss.on("connection", socket => {
  broadcastNumberOfUsers();
  socket.on("message", data => {
    console.log("message", data);
    const message = buildMessage(data);
    broadcast(JSON.stringify(message));
  });
});
