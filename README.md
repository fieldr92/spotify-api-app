# spotify-api-app
React app using OAuth to gain access to Spotify API

## How to set up

- Install dependencies in the root and client folders
- Go to https://developer.spotify.com/dashboard/applications and create a new App as a Website
- Once the app has been created, you will be provided with a client ID and client secret
- Go to "Edit settings" in the created app on developer.spotify.com and use the redirect URI `http://localhost:8888/callback` - PRESS SAVE!
- In the app's root folder run the following commands:-
  - `export SPOTIFY_CLIENT_ID={insert_client_id}`
  - `export SPOTIFY_CLIENT_SECRET={insert_client_secret}`
- Run `npm run dev` or `yarn dev` to start the app
- App will be running on http://localhost:3000 (may take a minute for the react side of the app to start)
