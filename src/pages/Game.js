import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';
import Questions from '../components/Questions';
import { saveTimeAction } from '../redux/actions';

class Game extends Component {
  constructor() {
    super();
    this.state = { timer: 0, seconds: 30, isButtonDisabled: false };
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer = () => {
    const MIL = 1000;
    this.setState({
      seconds: 30,
      isButtonDisabled: false,
    }, () => {
      this.setState({
        timer: setInterval(this.countDown, MIL),
      });
    });
  }

  stopTimer = () => {
    // console.log('stopTimer chamou');
    const { timer } = this.state;
    clearInterval(timer);
  }

  countDown = () => {
    const { seconds } = this.state;
    if (seconds > 0) {
      // console.log('countDown', seconds);
      this.setState({
        seconds: seconds - 1,
      });
    }
    if (seconds === 0) {
      this.setState({ isButtonDisabled: true });
      this.stopTimer();
    }
  }

  saveTimeToStore = () => {
    const { seconds } = this.state;
    const { saveTime } = this.props;
    saveTime(seconds);
  }

  disableBtn = () => {
    this.setState({
      isButtonDisabled: true,
    });
  }

  render() {
    const { isButtonDisabled, seconds } = this.state;
    return (
      <>
        <Header />
        <Questions
          isButtonDisabled={ isButtonDisabled }
          seconds={ seconds }
          saveTimeToStore={ this.saveTimeToStore }
          startTimer={ this.startTimer }
          stopTimer={ this.stopTimer }
          disableBtn={ this.disableBtn }
        />
      </>
    );
  }
}

Game.propTypes = {
  saveTime: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  saveTime: (time) => dispatch(saveTimeAction(time)),
});

export default connect(null, mapDispatchToProps)(Game);
