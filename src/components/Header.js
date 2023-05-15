import React, { Component } from 'react';
import propTypes from 'prop-types';
import md5 from 'crypto-js/md5';
import { connect } from 'react-redux';
import '../css/Header.css';

class Header extends Component {
  render() {
    const { gravatarEmailFromStore, nameFromStore, scoreFromStore } = this.props;
    const hashGerada = md5(gravatarEmailFromStore).toString();
    return (
      <header className="player-info">
        <div className="infoPlayer">
          <img
            src={ `https://www.gravatar.com/avatar/${hashGerada}` }
            alt="Imagem do jogador"
            data-testid="header-profile-picture"
          />
          <h3
            className="name"
            data-testid="header-player-name"
          >
            Player:
            {' '}
            {nameFromStore}
          </h3>
        </div>
        <h3 className="header-score">
          Points:
          {' '}
          <div
            data-testid="header-score"
            className="score"
          >
            {scoreFromStore}
          </div>
        </h3>
      </header>
    );
  }
}

const mapStateToProps = (store) => ({
  gravatarEmailFromStore: store.player.gravatarEmail,
  nameFromStore: store.player.name,
  scoreFromStore: store.player.score,
});

Header.propTypes = {
  gravatarEmailFromStore: propTypes.string,
  nameFromStore: propTypes.string,
  scoreFromStore: propTypes.number,
  dispatch: propTypes.func,
}.isRequired;

export default connect(mapStateToProps)(Header);
