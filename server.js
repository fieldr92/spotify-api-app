const express = require('express');
const request = require('request');
const querystring = require('querystring');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const redirect_uri = 
  process.env.REDIRECT_URI || 
  'http://localhost:8888/callback';

let access_token = null;
let refresh_token = null;

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
      access_token = body.access_token;
      refresh_token = body.refresh_token;
      const uri = process.env.FRONTEND_URI || 'http://localhost:3000';
      res.redirect(uri + '?access_token=' + access_token);
    }
  });
});

app.get('/refresh_token', (req, res) => {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };
  request.post(authOptions, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      access_token = body.access_token;
      const uri = process.env.FRONTEND_URI || 'http://localhost:3000';
      res.redirect(uri + '?access_token=' + access_token);
    } else {
      console.log(err);
    }
  });
});

const port = process.env.PORT || 8888;
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`);
app.listen(port);