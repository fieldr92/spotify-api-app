import history from '../history';
import {
  FETCH_USER,
  SIGN_OUT,
  CURRENT_SONG,
  UNAUTHORIZED_ERROR,
  FETCH_TOP_TRACKS,
  SET_ACTIVE_SONG
} from '../actions/types';

// App.js component

export const fetchUserData = url => async dispatch => {
  const res = await fetch(`${url}/v1/me`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('access_token')
    }
  });
  let data;
  if (res.status === 200) data = await res.json();
  else {
    dispatch({
      type: UNAUTHORIZED_ERROR,
      payload: { error: 'Unauthorized!' }
    });
    data = await refreshAccessToken(url, dispatch);
  }
  const { display_name, id } = data;
  dispatch({
    type: FETCH_USER,
    payload: {
      name: display_name,
      id,
      accessToken: localStorage.getItem('access_token')
    }
  });
};

const refreshAccessToken = async (url, dispatch) => {
  console.log('Getting new access token...');
  const res = await fetch('http://localhost:8888/refresh_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      refresh_token: localStorage.getItem('refresh_token')
    })
  });
  const data = await res.json();
  if (data.statusCode >= 400) return clearData(dispatch);
  console.log('New access token received!');
  localStorage.setItem('access_token', data.access_token);
  return fetchUserData(url);
};

export const clearUserData = () => async dispatch => {
  clearData(dispatch);
};

const clearData = dispatch => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  history.push('/');
  dispatch({ type: SIGN_OUT });
};

// Playlists.js

export const fetchPlaylists = (accessToken, url) => async dispatch => {
  const res = await fetch(`${url}/v1/me/playlists`, {
    headers: { Authorization: 'Bearer ' + accessToken }
  });
  const data = await res.json();
  if (!data.error)
    dispatch({
      type: 'PLAYLISTS',
      payload: data.items.map(item => ({
        name: item.name,
        imageUrl:
          item.images.length > 0 && item.images[0].url
            ? item.images[0].url
            : './assets/Spotify_Icon.png'
      }))
    });
};

// CurrentSong.js

export const fetchCurrentSong = accessToken => async dispatch => {
  const res = await fetch(
    'https://api.spotify.com/v1/me/player/currently-playing',
    { headers: { Authorization: 'Bearer ' + accessToken } }
  );
  if (res.status === 204) {
    dispatch({
      type: 'CURRENT_SONG_ERROR',
      payload: 'No content'
    });
  } else {
    const data = await res.json();
    if (data.error && data.error.status === 401)
      return dispatch({
        type: 'CURRENT_SONG_ERROR',
        payload: data.error.message
      });
    dispatch({
      type: CURRENT_SONG,
      payload: {
        song: data
      }
    });
  }
};

// TopTracks.js

export const fetchTopTracks = (accessToken, timeRange) => async dispatch => {
  try {
    const url = 'https://api.spotify.com';
    const res = await fetch(
      `${url}/v1/me/top/tracks?limit=20&time_range=${timeRange}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const data = await res.json();
    dispatch({
      type: FETCH_TOP_TRACKS,
      payload: data.items.map(({ artists, name, album, id, uri }) => ({
        artists: artists.map(artist => artist.name),
        name,
        id,
        album: album.name,
        albumArt: album.images[1].url,
        uri,
        active: false
      }))
    });
  } catch (err) {
    console.log(err);
    history.push('/');
  }
};

export const setActiveSongState = (tracks, active, trackIndex) => dispatch => {
  dispatch({
    type: SET_ACTIVE_SONG,
    payload: tracks.map((track, i) => {
      const copyTrack = { ...track };
      if (i === trackIndex) {
        if (active) {
          copyTrack.active = true;
          return copyTrack;
        }
        copyTrack.active = false;
        return copyTrack;
      }
      copyTrack.active = false;
      return copyTrack;
    })
  });
};
