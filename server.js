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

function buildMessage(data, color) {
  // parse the incoming message as it's a json string.
  const message = JSON.parse(data);

  //set the outgoing message with a UUID
  message.id = uuidv4();
  message.color = color;

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
* Random color generator 
* Get Users returns an array of all the users in system.
* https://stackoverflow.com/questions/1152024/best-way-to-generate-a-random-color-in-javascript/14187677#14187677
* @returns {string} Valid color
*/
function rainbow() {
  // 30 random hues with step of 12 degrees
  var hue = Math.floor(Math.random() * 30) * 12;

  return Color({
    hue: hue,
    saturation: 0.9,
    lightness: 0.6,
    alpha: 1
  }).toHexString();
}

/**
* Main loop on getting events. 
* Get Users returns an array of all the users in system.
*/

wss.on("connection", socket => {
  const color = "#" + parseInt(Math.random() * 0xffffff).toString(16);

  broadcastNumberOfUsers();
  console.log("connection", color);
  socket.on("message", data => {
    console.log("message", data, color);
    const message = buildMessage(data, color);
    broadcast(JSON.stringify(message));
  });

  socket.on("close", data => {
    broadcastNumberOfUsers();
  });
});
