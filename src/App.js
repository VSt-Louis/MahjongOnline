import React, { Component } from 'react';
import { Route, Link, NavLink, BrowserRouter as Router, Redirect, Switch} from 'react-router-dom';

//Components
import Join from './components/Join.jsx'; 
import CreateGame from './components/CreateGame.jsx'; 
import Game from './components/Game.jsx'; 

import './css/App.css';


function App() {
  return (
    <div className="App">
      
      
      <Router>
        <Switch>
          <Route path="/join">
            <Join/>
          </Route>
          <Route path="/create-game">
            <CreateGame/>
          </Route>
          <Route path="/game/:id">
            <Game/>
          </Route>
          <Route
            path="/quit"
            render={() => {
              sessionStorage.clear();
              return (<Redirect to='join'/>);
            }}
          />
          <Route path="*">
            <Redirect to='join'/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
