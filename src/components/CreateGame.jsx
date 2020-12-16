import React, { useState } from 'react';
import '../css/App.css';
import { io } from 'socket.io-client';
import RotateLoader from "react-spinners/RotateLoader";

//Supported rules
const supportedRules = [
  'American',
  'Japanese',
  'Chinese'
]




function CreateGame() {
  
  const [loading, setLoading] = useState(false);

  const createGame = (e) => {
    e.preventDefault();
    let settings = Object.fromEntries(new FormData(e.target).entries());
    setLoading(true);
    
    const socket = io('localhost:4000');
    socket.emit('new', settings);
    socket.on('new', (gameId) => {
      window.location.assign('/game/'+gameId)
    });
  }

  return (
    <div className='create-game'>
      {loading ? (
        <RotateLoader/>
      ) : (
        <div className='newGameForm'>
          <div className='title'>Create a game</div>
          <form onSubmit={createGame}>
            <span>
              Rules: 
              <select name="rules">
                {supportedRules.map((rule, i) => {return (<option value="{rule}" key={i}>{rule}</option>)})}
              </select>
            </span>
            <span>
              Use flowers and seasons ? 
              <input type='checkbox' defaultChecked>
                
              </input>
            </span>
            <input
              type='submit'
            >
            </input>
          </form>
        </div>
      )}
    </div>
  );
}

export default CreateGame;