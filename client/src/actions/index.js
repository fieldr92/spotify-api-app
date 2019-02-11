import { FETCH_USER, SIGN_OUT } from '../actions/types';

export const fetchUserData = url => async dispatch => {
  const res = await fetch(`${url}/v1/me`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('access_token')
    }
  });
  const data = await tryResponseData(res, url);
  const { display_name, id } = data;
  dispatch({
    type: FETCH_USER,
    payload: {
      name: display_name,
      id,
      accessToken: localStorage.getItem('access_token')
    }
  });
  return data;
};

const tryResponseData = (res, url) => {
  try {
    if (res.ok) return res.json();
    throw new Error('Access token expired...');
  } catch (err) {
    console.log(err.message);
    return refreshAccessToken(url);
  }
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
  const data = await setNewAccessToken(token, url);
  console.log('New access token received!');
  return data;
};

const setNewAccessToken = (token, url) => {
  localStorage.setItem('access_token', token.access_token);
  return fetchUserData(url);
};

export const clearUserData = () => async dispatch => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  dispatch({ type: SIGN_OUT });
};
