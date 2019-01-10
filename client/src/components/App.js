import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import TitleBar from './TitleBar/TitleBar';
import LoginPage from './LoginPage/LoginPage';
import Playlists from './Home/Playlists/Playlists';
import TopTracks from './Home/TopTracks/TopTracks';
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
        this.fetchUserData(url);
      }
    } else {
      this.fetchUserData(url);
    }
  }

  // fetchUserData = url => {
  //   return fetch(`${url}/v1/me`, {
  //     headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token')}
  //   })
  //   .then(res => {
  //     if (!res.ok) throw new Error('Token expired');
  //     return res.json();
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     return this.refreshAccessToken(url);
  //   })
  //   .then(data => {
  //     this.setState({ 
  //       userData: {
  //         name: data.display_name,
  //         id: data.id,
  //         accessToken: localStorage.getItem('access_token')
  //       }
  //     });
  //     return data;
  //   });
  // }

  fetchUserData = async url => {
    const res = await fetch(`${url}/v1/me`, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token')}
    })
    const data = await this.tryResponseData(res, url);
    this.setState({
      userData: {
        name: data.display_name,
        id: data.id,
        accessToken: localStorage.getItem('access_token')
      }
    });
    return data;
  }

  tryResponseData = (res, url) => {
    try {
      if (res.ok) return res.json();
      throw new Error('Token expired');
    } catch (err) {
      console.log(err);
      return this.refreshAccessToken(url);
    }
  }

  // refreshAccessToken = url => {
  //   console.log('Getting new access_token...');
  //   return fetch('http://localhost:8888/refresh_token', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ refresh_token: localStorage.getItem('refresh_token') })
  //   })
  //   .then(res => res.json())
  //   .then(token => {
  //     localStorage.setItem('access_token', token.access_token);
  //     return this.fetchUserData(url);
  //   })
  //   .then(data => {
  //     console.log('New access token received!')
  //     return data;
  //   });
  // }

  refreshAccessToken = async url => {
    console.log('Getting new access_token...');
    const res = await fetch('http://localhost:8888/refresh_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: localStorage.getItem('refresh_token') })
    })
    const token = await res.json();
    const data = await this.setNewAccessToken(token, url);
    console.log('New access token received!')
    return data;
  }

  setNewAccessToken = (token, url) => {
    localStorage.setItem('access_token', token.access_token);
    return this.fetchUserData(url);
  }

  clearUserData = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
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