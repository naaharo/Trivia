import React, { Component } from 'react';
import logo from '../images/trivia.png';
import '../App.css';

export default class LogoTrivia extends Component {
  render() {
    return (
      <div>
        <img
          className="App-logo"
          src={ logo }
          width="400px"
          alt="Logo do Jogo Trivia"
        />
      </div>
    );
  }
}
