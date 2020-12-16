const { v4: uuidv4 } = require('uuid');

//This is used to keep track of clients and update their socket id between refreshes

let clients = [];

//Client constructor
function Client(socket) {
  //Add client to list
  
  //Make sure no other client with same socketId is in the list
  let conflictingClients = clients.filter((client) => {
    return client.socketId == socket.id;
  });
  if (conflictingClients.length > 0) {
    throw Error('Cannot register client: already registered');
  }
  
  //create id that will not change
  let uuid = uuidv4();
  
  this.socketId = socket.id;
  this.uuid = uuid;
  this.name = '';
  
  clients.push(this);

  
  //instance methods
  
  this.unregister = () => {
    let index = clients.findIndex((client) => {client.uuid == this.uuid});
    if (index > -1) {
      clients.splice(index, 1);
    }
  }
  
  //Socket.io interface
  this.on = (event, cb) => {
    socket.on(event, cb);
  }
  
  this.emit = (event, data, cb) => {
    socket.emit(event, data, cb);
  }
}

//class method to update a client's socket id after it refreshes
const updateSocketId = (oldId, newId) => {
  console.log(`Changing socket ${oldId} for ${newId}`);
  let client = clients.find((client) => client.socketId == oldId);
  client.socketId = newId;
}

module.exports = { Client, updateSocketId };