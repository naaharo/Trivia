import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { decode } from 'he';
import Button from './Button';
import '../css/Questions.css';

export default class MultipleBtn extends Component {
  render() {
    const { isButtonDisabled, okAnswer, rightAnswer,
      onClickAnswer, shuffledAnswers } = this.props;
    return (
      <div className="answerCard" data-testid="answer-options">
        { shuffledAnswers.map((answer, mapIndex) => (
          answer === rightAnswer
            ? (
              <Button
                value={ decode(answer) }
                buttonId="correctAnswer"
                buttonClass={ okAnswer ? 'correctAnswer' : 'answer' }
                answerRorW="correct-answer"
                isButtonDisabled={ isButtonDisabled }
                key={ `answerBtn${mapIndex}` }
                onClickFunction={ onClickAnswer }
                answer={ answer }
              />
            )
            : (
              <Button
                value={ decode(answer) }
                buttonId="wrongAnswer"
                buttonClass={ okAnswer ? 'wrongAnswer' : 'answer' }
                answerRorW="wrong-answer"
                isButtonDisabled={ isButtonDisabled }
                key={ `answerBtn${mapIndex}` }
                onClickFunction={ onClickAnswer }
                answer={ answer }
              />
            )
        )) }
      </div>);
  }
}

MultipleBtn.propTypes = {
  onClickAnswer: PropTypes.func,
  okAnswer: PropTypes.bool,
  rightAnswer: PropTypes.string,
  isButtonDisabled: PropTypes.bool,
}.isRequired;
