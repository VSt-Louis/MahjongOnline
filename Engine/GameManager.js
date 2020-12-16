//this array will hold the active games objects
let games = [];

//Game constructor
function Game(rules, io) {
  this.id = Math.floor(Math.random() * 90000) + 10000; //10000 to 99999
  this.rules = rules;
  this.roomSocket = {};
  
  games.push(this);
  
  let players = [];
  let dominantWind = 0; //East, South, West, North
  
  //public
  this.getPlayers = () => {return players;}
  this.addPlayer = (client) => {
    if (players.length >= 4) {
      throw Error('Cannot add player: Game is full');
    }
    players.push(client);
    
    //request client name
    client.emit('query', 'name', (name) => {
      client.name = name;
      console.log(`${name} joined game ${this.id} [${players.length}/4]`);
      this.informPlayers({
        players: players.map(p => p.name || 'Joining...'),
        rules: this.rules,
      });
    });
    
    
    
    //if that was the fourth player, start game
    if (players.length == 4) gameInit();
  }
  
  this.informPlayers = (status) => {
    players.forEach((client) => {
      client.emit('status', status);
    });
  }
  
  const gameInit = () => {
    if (players.length < 4) {
      return "game is not full";
    }
    
    this.informPlayers({
      gamePhase: 'setup'
    });
    
    //determine first dealer (and assign winds)

    //shuffle tiles

    //distribute tiles (dealer has 14)

    //start game and take turns

      //draw

      //discard

      //pon/chow

      //next player

    //declare winner
  }
}

//class function to add a client to a game knowing its id
const joinGame = (gameId, client) => {
  let game = games.find(game => game.id == gameId);
  if (!game) {
    throw Error('Cannot join game : id does not exist');
  }
  
  //add it to the game
  game.addPlayer(client);
}


module.exports = { Game, joinGame }