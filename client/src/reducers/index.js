import { combineReducers } from 'redux';
import authReducer from './authReducers';
import musicReducer from './musicReducer';

export default combineReducers({
  auth: authReducer,
  music: musicReducer
});
