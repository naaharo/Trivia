import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { decode } from 'he';
import getQuestionsFromAPI from '../services/api';
import { myScore, invalidCode } from './Functions';
import { savePlayerEmailAction, savePlayerNameAction,
  savePlayerAssertionAction, saveScoreAction } from '../redux/actions';
import '../css/Questions.css';
import Feedback from '../pages/Feedback';
import BooleanBtn from './BooleanBtn';
import MultipleBtn from './MultipleBtn';
import Loading from './Loading';

class Questions extends Component {
  constructor() {
    super();
    this.state = {
      questionsArray: [],
      index: 0,
      difficulty: '',
      question: '',
      category: '',
      type: '',
      rightAnswer: '',
      isFetching: false,
      okAnswer: false,
      nextButton: false,
      scorePlayer: 0,
      assertionsToStore: 1,
      shuffledAnswers: [],
    };
  }

  async componentDidMount() {
    const savedToken = localStorage.getItem('token');
    const { startTimer, history, savePlayerEmail, savePlayerName } = this.props;
    this.setState({ isFetching: true }, async () => {
      const questions = await getQuestionsFromAPI(savedToken);
      const INVALID_CODE = 3;
      if (questions.response_code === INVALID_CODE) {
        invalidCode(history, savePlayerEmail, savePlayerName);
      } else {
        const shuffle = this.shuffleAnswers(questions.results);
        this.setState({
          questionsArray: questions.results,
          difficulty: questions.results[0].difficulty,
          question: questions.results[0].question,
          category: questions.results[0].category,
          type: questions.results[0].type,
          rightAnswer: questions.results[0].correct_answer,
          isFetching: false,
          shuffledAnswers: shuffle,
        });
        startTimer();
      }
    });
  }

  shuffleAnswers = (questionsArray) => {
    const { index } = this.state;
    const rightAnswer = questionsArray[index].correct_answer;
    // console.log('\nResposta:', rightAnswer);
    const wrongAnswers = questionsArray[index].incorrect_answers;
    const allAnswers = [...wrongAnswers, rightAnswer];
    const LIMIT_VALUE = 0.5;
    const shuffledArray = allAnswers.sort(() => Math.random() - LIMIT_VALUE);
    localStorage.setItem('difficulty', questionsArray[index].difficulty);
    return shuffledArray;
  }

  onClickAnswer = async ({ target }) => {
    const { rightAnswer, assertionsToStore } = this.state;
    const { saveScore, savePlayerAssertion, stopTimer,
      saveTimeToStore, disableBtn } = this.props;
    stopTimer();
    disableBtn();
    await saveTimeToStore();
    const { clickedTime } = this.props;
    // console.log('clickedTime:', clickedTime);
    const score = rightAnswer === target.value ? myScore(clickedTime) : 0;
    this.setState((prevState) => ({
      okAnswer: true,
      scorePlayer: prevState.scorePlayer + score,
      nextButton: true,
    }), () => {
      const { scorePlayer } = this.state;
      saveScore(scorePlayer);
    });
    if (target.id === 'correctAnswer') {
      savePlayerAssertion(assertionsToStore);
      this.setState({ assertionsToStore: assertionsToStore + 1 });
    }
  }

  changeQuestion = () => {
    const { history } = this.props;
    const { index } = this.state;
    const FOUR = 4;
    this.setState((prevState) => ({ index: prevState.index + 1,
      okAnswer: false,
      nextButton: false,
    }), () => { this.changeState(); });
    if (index === FOUR) { history.push('/feedback'); }
  }

  changeState = () => {
    const { index, questionsArray } = this.state;
    const { startTimer } = this.props;
    const shuffle = this.shuffleAnswers(questionsArray);
    this.setState({
      difficulty: questionsArray[index].difficulty,
      question: questionsArray[index].question,
      category: questionsArray[index].category,
      type: questionsArray[index].type,
      rightAnswer: questionsArray[index].correct_answer,
      shuffledAnswers: shuffle,
    });
    startTimer();
  }

  render() {
    const { question, difficulty, category, type, index, isFetching,
      nextButton, rightAnswer, okAnswer, questionsArray, shuffledAnswers } = this.state;
    const { seconds, isButtonDisabled } = this.props;
    const MAX_INDEX_VALUE = 4;
    return (
      isFetching ? <Loading />
        : (
          <main className="questionCard">
            <div>
              <h4
                className="category"
                data-testid="question-category"
              >
                { `Category: ${category}` }
              </h4>
              <h4 className="difficulty">{ `Difficulty: ${difficulty}` }</h4>
            </div>
            <h3
              className="question"
              data-testid="question-text"
            >
              { decode(question) }
            </h3>
            { type === 'multiple'
              ? (
                <MultipleBtn
                  shuffledAnswers={ shuffledAnswers }
                  isButtonDisabled={ isButtonDisabled }
                  okAnswer={ okAnswer }
                  rightAnswer={ rightAnswer }
                  onClickAnswer={ this.onClickAnswer }
                  questionsArray={ questionsArray }
                  index={ index }
                  difficulty={ difficulty }
                />)
              : (
                <BooleanBtn
                  shuffledAnswers={ shuffledAnswers }
                  isButtonDisabled={ isButtonDisabled }
                  okAnswer={ okAnswer }
                  rightAnswer={ rightAnswer }
                  onClickAnswer={ this.onClickAnswer }
                />)}
            <div className="timer">
              Time:
              {' '}
              {seconds}
            </div>
            { index <= MAX_INDEX_VALUE && nextButton
              && (
                <button
                  type="button"
                  data-testid="btn-next"
                  onClick={ this.changeQuestion }
                  className="next-button"
                >
                  Next
                </button>)}
            { index > MAX_INDEX_VALUE && (<Feedback />)}
          </main>
        )
    );
  }
}

Questions.propTypes = {
  history: PropTypes.objectOf(PropTypes.any),
  isButtonDisabled: PropTypes.bool,
  savePlayerName: PropTypes.func,
  savePlayerEmail: PropTypes.func,
  savePlayerAssertion: PropTypes.func,
  seconds: PropTypes.number,
  clickedTime: PropTypes.number,
  stopTimer: PropTypes.func,
  startTimer: PropTypes.func,
  saveTimeToStore: PropTypes.func,
  saveScore: PropTypes.func,
  disableBtn: PropTypes.func,
}.isRequired;

const mapDispatchToProps = (dispatch) => ({
  savePlayerName: (name) => dispatch(savePlayerNameAction(name)),
  savePlayerEmail: (email) => dispatch(savePlayerEmailAction(email)),
  saveScore: (score) => dispatch(saveScoreAction(score)),
  savePlayerAssertion: (assertions) => dispatch(savePlayerAssertionAction(assertions)),
});

const mapStateToProps = (state) => ({
  storeToken: state.token,
  clickedTime: state.tempo.time,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Questions));
