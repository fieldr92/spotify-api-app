import React, { Component } from 'react';
import TitleBar from './TitleBar/TitleBar';
import LoginPage from './LoginPage/LoginPage';
import Playlists from './Playlists/Playlists';
import './App.css';

class App extends Component {
  state = {
    userData: null,
    playlists: null
  };

  componentDidMount() {
    const url = 'https://api.spotify.com'
    const accessToken = new URLSearchParams(window.location.search).get('access_token');

    if (accessToken) {
      fetch(`${url}/v1/me`, {
        headers: { 'Authorization': 'Bearer ' + accessToken }
      }).then(response => response.json())
      .then(data => {
        this.setState({ 
          userData: {
            name: data.display_name,
            id: data.id
          }
        });
      });
  
      fetch(`${url}/v1/me/playlists`, {
        headers: { 'Authorization': 'Bearer ' + accessToken }
      }).then(res => res.json())
      .then(data => {
        this.setState({
          playlists: data.items.map(item => ({
            name: item.name,
            imageUrl: item.images[0].url ? item.images[0].url : 'https://profile-images.scdn.co/images/userprofile/default/3c93d52857ecf3e40c4e8435adb7f9c1da40a0dd'
          })
        )});
      });
    }
  }

  clearUserData = () => {
    this.setState({ userData: null });
  }

  handleData = ({ userData, playlists }) => {
    if (userData) {
      return (
        <>
          <TitleBar
            clearUserData={this.clearUserData}
          />
          <h1 style={{ width: '100%', textAlign: 'center' }}>Welcome to your Spotify, {userData.name}!</h1>
          <Playlists
            userData={userData}
            playlists={playlists}
            clearUserData={this.clearUserData}
          />
        </>
      )
    } else {
      return (
        <>
          <LoginPage />
        </>
      );
    }
  }

  render() {
    return (
      <>{this.handleData(this.state)}</>
    );
  }
}

export default App;