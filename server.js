const express = require('express');
const request = require('request');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const {
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_CLIENT_ID,
  REDIRECT_URI,
  FRONTEND_URI,
  PORT
} = process.env;

const redirect_uri = REDIRECT_URI || 'http://localhost:8888/callback';

app.get('/login', (req, res) => {
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: SPOTIFY_CLIENT_ID,
        scope: 'user-read-private user-read-email user-top-read',
        redirect_uri
      })
  );
});

const AuthString = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
).toString('base64');
const Authorization = `Basic ${AuthString}`;

app.get('/callback', (req, res) => {
  const { code } = req.query || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      Authorization
    },
    json: true
  };
  request.post(authOptions, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      const { access_token } = body;
      const { refresh_token } = body;
      const uri = FRONTEND_URI || 'http://localhost:3000';
      res.redirect(
        uri +
          '?access_token=' +
          access_token +
          '&refresh_token=' +
          refresh_token
      );
    }
  });
});

app.post('/refresh_token', (req, res) => {
  const { refresh_token } = req.body;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token
    },
    json: true
  };
  request.post(authOptions, (err, response, body) => {
    if (err) {
      console.log(err);
    }
    if (!err && response.statusCode === 200) {
      const { access_token } = body;
      res.send(JSON.stringify({ access_token }));
    }
  });
});

const port = PORT || 8888;
console.log(
  `Listening on port ${port}. Go /login to initiate authentication flow.`
);
app.listen(port);
