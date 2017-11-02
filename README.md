![Chatty](https://github.com/shawnkgriffin/lighthouse-chatty/blob/master/docs/Titlebar.png)
# Chatty Server

Many of the web applications that we use today have real-time functionality where the user does not have to reload the page in order to see updates. Major examples of these include Slack, Twitter and Facebook.

This server provides the routing for the messages from the Chatty App client, which can be found [here](https://github.com/shawnkgriffin/lighthouse-chatty).

The functional requirements, and their status can be found [here](https://github.com/shawnkgriffin/lighthouse-chatty/blob/master/docs/Functional%20Requirements.md). 

## Screen Shots
![4 Users](https://github.com/shawnkgriffin/lighthouse-chatty/blob/master/docs/Screenshot.png "Sample Session.")


## Getting Started

1. Fork this repository, then clone your fork of this repository.
2. Install dependencies using the `npm install` command.
3. Run the server using `npm run start`.

## Dependencies

- uuid-v4
- express
- ws