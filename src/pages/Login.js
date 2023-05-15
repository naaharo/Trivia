import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { savePlayerNameAction, savePlayerEmailAction,
  saveTokenAction } from '../redux/actions/index';
import LogoTrivia from '../components/LogoTrivia';
import '../css/Login.css';
import Loading from '../components/Loading';
// codado em pair programing All - Carla Heyde/Nata Abrahão/Paulo Bruno/Priscila Nogueira/Elaine Costa

class Login extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      loginButtonDisabled: true,
      fetching: false,
    };
  }

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value }, () => {
      this.validateButton();
    });
  }

  validateButton = () => {
    const { email, name } = this.state;
    const regexEmail = /\S+@\S+\.\S+/;
    const enable = false;
    const disable = true;
    this.setState({
      loginButtonDisabled: regexEmail.test(email)
        && name.length > 0 ? enable : disable,
    });
  }

  getToken = async () => {
    const URL = 'https://opentdb.com/api_token.php?command=request';
    const response = await fetch(URL);
    const result = await response.json();
    return result.token;
  }

  onSubmit = async () => {
    const { savePlayerName, savePlayerEmail, saveToken, history } = this.props;
    const { name, email } = this.state;
    this.setState({
      fetching: true,
    }, async () => {
      const token = await this.getToken();
      localStorage.setItem('token', token);
      savePlayerName(name);
      savePlayerEmail(email);
      saveToken(token);
      this.setState({
        fetching: false,
      }, () => history.push('/game'));
    });
  }

  render() {
    const { email, name, loginButtonDisabled, fetching } = this.state;
    return (
      fetching ? <Loading />
        : (
          <div className="App">
            <LogoTrivia />
            <form className="login">
              <label className="label" htmlFor="email">
                Email
                <input
                  className="input"
                  type="email"
                  value={ email }
                  name="email"
                  id="email"
                  placeholder="Type your email"
                  onChange={ this.handleChange }
                  data-testid="input-gravatar-email"
                />
              </label>
              <label className="label" htmlFor="name">
                Name
                <input
                  className="input"
                  type="text"
                  id="name"
                  value={ name }
                  name="name"
                  placeholder="Type your name"
                  onChange={ this.handleChange }
                  data-testid="input-player-name"
                />
              </label>
              <button
                className="button-submit"
                type="button"
                name="login-button"
                disabled={ loginButtonDisabled }
                data-testid="btn-play"
                onClick={ this.onSubmit }
              >
                Play
              </button>
              <Link to="/config">
                <button
                  className="button-config"
                  type="button"
                  name="config-button"
                  data-testid="btn-settings"
                >
                  Configuration
                </button>
              </Link>
            </form>
          </div>
        )
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  savePlayerName: (name) => dispatch(savePlayerNameAction(name)),
  savePlayerEmail: (email) => dispatch(savePlayerEmailAction(email)),
  saveToken: (token) => dispatch(saveTokenAction(token)),
});

Login.propTypes = {
  savePlayerName: PropTypes.func.isRequired,
  savePlayerEmail: PropTypes.func.isRequired,
  saveToken: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
