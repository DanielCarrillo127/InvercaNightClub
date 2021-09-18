require('dotenv').config();
const Server = require('./src/app/server');

const server = new Server();

server.listen();


