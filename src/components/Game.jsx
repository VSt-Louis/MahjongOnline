import React, { Component, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

import Dialog from './Dialog.jsx';

import '../css/App.css';

const connectToGame = (id, oldSocket) => {
  const socket = io('localhost:4000', {
    auth: {
      gameid: id,
      oldSocket
    }
  });
  return socket;
}

//Component
function Game(props) {
  
  const socket = useRef({});
  let { id } = useParams();
  
  const [name, setName] = useState(sessionStorage.getItem('playerName'));
  const [dialog, setDialog] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState({});

  useEffect(() => {
    if (!name) {
      //TODO: check if game is full before requesting name
      let submitName = (e) => {
        e.preventDefault();
        let formDataObj = Object.fromEntries(new FormData(e.target).entries());
        let name = formDataObj.name
        sessionStorage.setItem('playerName', name);
        setName(name);
        setDialog('');
      }
      setDialog(
        <Dialog height={150} width={350}>
          <div className='namePrompt'>
            <div className='title'>What is your name ?</div>
            <form onSubmit={submitName}>
              <input
                type='text'
                name='name'
                placeholder='Your name'
              >
              </input>
              <input type='submit'></input>
            </form>
          </div>
        </Dialog>
      );
    } else {
      socket.current = connectToGame(id, sessionStorage.getItem('lastSocketId'));
      socket.current.on('connect', () => {
        console.log(socket.current.id);
        sessionStorage.setItem('lastSocketId', socket.current.id);
      });
      socket.current.on('error', (err) => {
        setError(err)
      });
      socket.current.on('status', (status) => {
        setStatus((currentStatus) => { return {...currentStatus, ...status}});
      });
      socket.current.on('query', (query, cb) => {
        if (query == 'name') {
          cb(name);
        }
      });
      
    }
  }, [name, name == '' ? Math.random() : '']);
  
  
  const send = (message) => {
    socket.current.send(message)
  }
  
  
  
  return (
    <div>
      {dialog}
      {error}
      <div>Game id is {id}</div>
      <div>Your name is {name}</div>
      <div>You are playing with: {status.players?.filter(p => p != name).join(', ')}</div>
      <div>Game phase: {status.gamePhase}</div>
      
      Test connection with the socket

      <button onClick={send.bind(this, 1)}>1</button>
      <button onClick={send.bind(this, 2)}>2</button>
      <button onClick={send.bind(this, 3)}>3</button>
    </div>
  );
}

export default Game;