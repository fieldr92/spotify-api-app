import {
  PLAYLISTS,
  CURRENT_SONG,
  CURRENT_SONG_ERROR,
  FETCH_TOP_TRACKS,
  SET_ACTIVE_SONG,
  SIGN_OUT
} from '../actions/types';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PLAYLISTS:
      return { ...state, playlists: action.payload };
    case CURRENT_SONG:
      return { ...state, ...action.payload };
    case CURRENT_SONG_ERROR:
      return { ...state, error: action.payload };
    case FETCH_TOP_TRACKS:
      return { ...state, tracks: action.payload };
    case SET_ACTIVE_SONG:
      return { ...state, tracks: action.payload };
    case SIGN_OUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};
