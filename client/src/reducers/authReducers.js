import { FETCH_USER, SIGN_OUT } from '../actions/types';

const INITIAL_STATE = {
  userData: null,
  isSignedIn: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_USER:
      return { ...state, userData: action.payload, isSignedIn: true };
    case SIGN_OUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};
