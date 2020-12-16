import React, { Component } from 'react';
import RotateLoader from "react-spinners/RotateLoader";

import '../css/App.css';

import Dialog from './Dialog.jsx';

//component
function Join() {

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(sessionStorage.getItem('playerName'));
  const [dialog, setDialog] = useState('');
  const [error, setError] = useState('');


  const tryId = (id) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      const socket = io('localhost:4000', {
        auth: {
          gameid: id
        }
      });
      socket.on('error', (err) => {
        setLoading(false);
      });
      socket.on('join', (id) => {
        setLoading(false);
      });
    });
  }
  
  const checkName = () => {
    if (!name) {
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
    }
  }
  
  const handleSubmitId = (e) => {
    e.preventDefault();
    let formDataObj = Object.fromEntries(new FormData(e.target).entries());
    let id = formDataObj.gameid;
    tryId(id)
    .then(id => {
      console.log(`joining game ${id}`);
      window.location.assign('/game/'+id);
    });
  }

  return (
    <div className='join'>
      {loading ? (
        <RotateLoader/>
      ) : (
        <div>
          {dialog}
          {error}
          <div className='idForm'>
            <div className='title'>Enter the id of the game to join:</div>
            <form onSubmit={handleSubmitId}>
              <input
                type='text'
                name='gameid'
                placeholder={`ex: ${Math.floor(Math.random() * 90000) + 10000}`}
              >
              </input>
              <input type='submit'></input>
              <div className='subtext'>Or <a href='/create-game'>create a new game</a>.</div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Join;