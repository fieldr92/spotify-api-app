import React, { Component } from 'react';
import Playlists from './Playlists';

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

  handleData() {
    if (this.state.userData) {
      return (
        <Playlists
          userData={this.state.userData}
          playlists={this.state.playlists}
          clearUserData={this.clearUserData}
        />
      )
    } else {
      return (
        <div>
          <h1>Please login to access data...</h1>
          <button onClick={() => window.location='http://localhost:8888/login'}>Login to Spotify!</button>
        </div>
      );
    }
  }

  render() {
    return (
      <>{this.handleData()}</>
    );
  }
}

export default App;