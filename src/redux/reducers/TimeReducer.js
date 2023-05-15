import { SET_TIME_ANSWER } from '../actions/index';

const INITIAL_STATE = {
  time: 0,
};

const tempo = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case SET_TIME_ANSWER:
    return {
      ...state,
      time: action.time };
  default:
    return state;
  }
};

export default tempo;
