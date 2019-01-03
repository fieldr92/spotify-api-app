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

  clearUserData = () => {
    localStorage.removeItem('access_token');
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