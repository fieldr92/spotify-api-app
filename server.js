const express = require('express');
const request = require('request');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const redirect_uri = 
  process.env.REDIRECT_URI || 
  'http://localhost:8888/callback';

app.get('/login', (req, res) => {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email user-top-read',
      redirect_uri
    }));
});

app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  };
  request.post(authOptions, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      const access_token = body.access_token;
      const refresh_token = body.refresh_token;
      const uri = process.env.FRONTEND_URI || 'http://localhost:3000';
      res.redirect(uri + '?access_token=' + access_token + '&refresh_token=' + refresh_token);
    }
  });
});

app.post('/refresh_token', (req, res) => {
  const refresh_token = req.body.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token
    },
    json: true
  };
  request.post(authOptions, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send(JSON.stringify({ access_token: access_token }));
    }
  });
});

const port = process.env.PORT || 8888;
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`);
app.listen(port);