import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Game from './pages/Game';
import Config from './pages/Config';
import Ranking from './pages/Ranking';
import Feedback from './pages/Feedback';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Switch>
          <Route exact path="/ranking" component={ Ranking } />
          <Route exact path="/feedback" component={ Feedback } />
          <Route exact path="/config" component={ Config } />
          <Route exact path="/game" component={ Game } />
          <Route exact path="/" component={ Login } />
        </Switch>
      </div>
    );
  }
}

export default App;
