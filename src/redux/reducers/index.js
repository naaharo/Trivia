import { combineReducers } from 'redux';
import player from './PlayerReducer';
import token from './TokenReducer';
import tempo from './TimeReducer';

const rootReducer = combineReducers({ player, token, tempo });

export default rootReducer;
