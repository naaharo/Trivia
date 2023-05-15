import { SET_PLAYER_NAME, SET_PLAYER_EMAIL,
  SET_PLAYER_ASSERTIONS, SET_PLAYER_SCORE } from '../actions/index';

const INITIAL_STATE = {
  name: '',
  assertions: 0,
  score: 0,
  gravatarEmail: '',
};

const player = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case SET_PLAYER_NAME:
    return {
      ...state,
      name: action.name,
    };
  case SET_PLAYER_EMAIL:
    return {
      ...state,
      gravatarEmail: action.gravatarEmail,
    };
  case SET_PLAYER_ASSERTIONS:
    return {
      ...state,
      assertions: action.assertions,
    };
  case SET_PLAYER_SCORE:
    return {
      ...state,
      score: action.score,
    };
  default:
    return state;
  }
};

export default player;
