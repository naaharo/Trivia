import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import Header from '../components/Header';
import LogoTrivia from '../components/LogoTrivia';
import '../css/Feedback.css';

class Feedback extends Component {
  constructor() {
    super();
    this.state = {
      feedbackMessage: '',
    };
  }

  componentDidMount() {
    const { assertionsFromStore } = this.props;
    this.setFeedbackMessage(assertionsFromStore);
    this.setRankingByPlayer();
  }

  setRankingByPlayer = () => {
    const { nameFromStore, scoreFromStore, gravatarEmailFromStore } = this.props;
    const hashGerada = md5(gravatarEmailFromStore).toString();
    const ranks = JSON.parse(localStorage.getItem('ranking'));
    const playerRank = { name: nameFromStore, score: scoreFromStore, picture: `https://www.gravatar.com/avatar/${hashGerada}` };
    if (ranks) {
      localStorage.setItem('ranking', JSON.stringify([...ranks, playerRank]));
    } else {
      localStorage.setItem('ranking', JSON.stringify([playerRank]));
    }
  }

  setFeedbackMessage(assertionsFromStore) {
    const MIN_CORRECT_ANSWERS = 3;
    if (assertionsFromStore >= MIN_CORRECT_ANSWERS) {
      this.setState({
        feedbackMessage: 'Well Done!',
      });
    } else {
      this.setState({
        feedbackMessage: 'Could be better...',
      });
    }
  }

  render() {
    const { feedbackMessage } = this.state;
    const { score, assertionsFromStore } = this.props;
    return (
      <main>
        <Header />
        <div className="feedbackCard">
          <LogoTrivia />
          <h2
            className="feedback-message"
            data-testid="feedback-text"
          >
            {feedbackMessage}
          </h2>
          <section className="score-message">
            <span>Final score: You did</span>
            <span
              className="scorePoints"
              data-testid="feedback-total-score"
            >
              { ` ${score} ` }
            </span>
            <span>points!</span>
          </section>
          <section className="assertions-message">
            <span>Assertions:</span>
            <span
              className="assertions"
              data-testid="feedback-total-question"
            >
              { ` ${assertionsFromStore} ` }
            </span>
          </section>
          <Link to="/">
            <button
              className="play-again-button"
              type="button"
              name="play-again-button"
              data-testid="btn-play-again"
            >
              Play Again
            </button>
          </Link>
          <br />
          <Link to="/ranking">
            <button
              className="ranking-button"
              type="button"
              name="ranking-button"
              data-testid="btn-ranking"
            >
              Ranking
            </button>
          </Link>
        </div>
      </main>
    );
  }
}

const mapStateToProps = (store) => ({
  assertionsFromStore: store.player.assertions,
  score: store.player.score,
  gravatarEmailFromStore: store.player.gravatarEmail,
  nameFromStore: store.player.name,
  scoreFromStore: store.player.score,
});

Feedback.propTypes = {
  assertionsFromStore: PropTypes.number,
  score: PropTypes.number,
  gravatarEmailFromStore: PropTypes.string,
  nameFromStore: PropTypes.string,
  scoreFromStore: PropTypes.number,
}.isRequired;

export default connect(mapStateToProps, null)(Feedback);
