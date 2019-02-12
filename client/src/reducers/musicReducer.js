import { PLAYLISTS, CURRENT_SONG, CURRENT_SONG_ERROR } from '../actions/types';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PLAYLISTS:
      return { ...state, playlists: action.payload };
    case CURRENT_SONG:
      return { ...state, ...action.payload };
    case CURRENT_SONG_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
