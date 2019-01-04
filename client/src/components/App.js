import React, { Component } from 'react';
import TitleBar from './TitleBar/TitleBar';
import LoginPage from './LoginPage/LoginPage';
import Playlists from './Playlists/Playlists';
import TopTracks from './TopTracks/TopTracks';
import './App.css';

class App extends Component {
  state = {
    userData: null
  };

  componentDidMount() {
    const url = 'https://api.spotify.com';

    if (!localStorage.getItem('access_token')) {
      if (new URLSearchParams(window.location.search).get('access_token')) {
        localStorage.setItem('access_token', new URLSearchParams(window.location.search).get('access_token'));
        localStorage.setItem('refresh_token', new URLSearchParams(window.location.search).get('refresh_token'));
        this.setTokenExpiration();

        fetch(`${url}/v1/me`, {
          headers: { 'Authorization': 'Bearer ' + new URLSearchParams(window.location.search).get('access_token')}
        }).then(response => response.json())
        .then(data => {
          this.setState({ 
            userData: {
              name: data.display_name,
              id: data.id,
              accessToken: new URLSearchParams(window.location.search).get('access_token')
            }
          });
        });
      }
    } else {
      fetch(`${url}/v1/me`, {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token')}
      }).then(response => response.json())
      .then(data => {
        this.setState({ 
          userData: {
            name: data.display_name,
            id: data.id,
            accessToken: localStorage.getItem('access_token')
          }
        });
      });
    }
  }

  setTokenExpiration = () => {
    let expirationDuration = new URLSearchParams(window.location.search).get('expires_in')
    const tokenExpiration = new Date();
    tokenExpiration.setSeconds(new Date().getSeconds() + parseInt(expirationDuration));
    if (!localStorage.getItem('token_expiration')) {
      localStorage.setItem('token_expiration', tokenExpiration);
    } else {
      console.log(localStorage.getItem('token_expiration'));
    }
  }

  clearUserData = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('token_expiration');
    this.setState({ userData: null });
  }

  render() {
    const { userData } = this.state;

    if (!userData) return <LoginPage />;
    
    return (
      <>
        <TitleBar
          clearUserData={this.clearUserData}
        />
        <h1 style={{ width: '100%', textAlign: 'center' }}>Welcome to your Spotify, {userData.name}!</h1>
        <div className='playlist-toptracks'>
          <Playlists
            accessToken={userData.accessToken}
            clearUserData={this.clearUserData}
          />
          <TopTracks accessToken={userData.accessToken} />
        </div>
      </>
    )
  }
}

export default App;