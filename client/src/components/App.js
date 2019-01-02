import React, { Component } from 'react';

class App extends Component {
  state = {
    userData: null,
    playlists: null
  };

  componentDidMount() {
    const url = 'https://api.spotify.com'
    const accessToken = new URLSearchParams(window.location.search).get('access_token');

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
          image: item.images[1]
        }))
      });
      console.log(this.state.playlists);
      console.log(this.state.userData.id);
    });
  }

  handleData() {
    if (this.state.userData) {
      return (
        <div>
          <h1>Welcome to my Spotify app, {this.state.userData.name}!</h1>
          <button onClick={() => {
            this.setState({ userData: null });
          }}>LOGOUT</button>
        </div>
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