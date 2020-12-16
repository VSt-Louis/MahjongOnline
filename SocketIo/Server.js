const SocketIo = require('socket.io');
const ClientManager = require('./ClientManager.js');
const GameManager = require('../Engine/GameManager.js');
const { Client } = ClientManager;
const { Game } = GameManager;


const PORT = 4000;
const io = SocketIo(PORT, {
  serveClient: false,
  cors: {
    origin: '*',
  }
});



let activeGames = [];


io.on("connection", (socket) => {
  let gameId = socket.handshake.auth.gameid;
  let previousSocketId = socket.handshake.auth.oldSocket
  
  //if no game id is passed, the connection acts as a request for a new game
  if (!gameId) {
    console.log(`new anonymous Connection with ${socket.id}`);
    //when ready, the client will send the 'new' event with game settings
    socket.on('new', (settings) => {
      
      //create game using Game constructor
      let game = new Game(settings, io);
      console.log(`Created new game with id: ${game.id}`);
      
      //when the game is ready, the server will send the 'new' event with the game id
      socket.emit('new', game.id);
    });
    
  } else {
    
    //if the client was already connected, but refreshed the page, it will provide its old socketId that can be used to update the Client object
    if (previousSocketId) {
      //update socketId
      ClientManager.updateSocketId(previousSocketId, socket.id);
    } else {
      //create Client
      let client = new Client(socket);
      //pass client to game
      try {
        GameManager.joinGame(gameId, client);
      } catch (e) {
        socket.emit('error', e.message);
      }
    }
    
    
    
    //testing
    socket.on('message', (m) => {
      console.log(`Game-${gameId}: ${m}`)
    });
    
  }
});


console.log('Socket.io Server listening on port ' + PORT)