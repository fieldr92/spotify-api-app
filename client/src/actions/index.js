import {
  FETCH_USER,
  SIGN_OUT,
  CURRENT_SONG,
  UNAUTHORIZED_ERROR
} from '../actions/types';

// App component

export const fetchUserData = url => async dispatch => {
  const res = await fetch(`${url}/v1/me`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('access_token')
    }
  });
  let data;
  if (res.status === 200) {
    data = res.json();
  } else {
    data = await refreshAccessToken(url);
    dispatch({
      type: UNAUTHORIZED_ERROR,
      payload: {
        error: 'Unauthorized!'
      }
    });
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

const refreshAccessToken = async url => {
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
  const token = await res.json();
  console.log('New access token received!');
  localStorage.setItem('access_token', token.access_token);
  return fetchUserData(url);
};

export const clearUserData = () => async dispatch => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  dispatch({ type: SIGN_OUT });
};

// PLaylists component

export const fetchPlaylists = (accessToken, url) => async dispatch => {
  const res = await fetch(`${url}/v1/me/playlists`, {
    headers: { Authorization: 'Bearer ' + accessToken }
  });
  const data = await res.json();
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

// Current song component

export const fetchCurrentSong = accessToken => async dispatch => {
  const res = await fetch(
    'https://api.spotify.com/v1/me/player/currently-playing',
    { headers: { Authorization: 'Bearer ' + accessToken } }
  );
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
};
