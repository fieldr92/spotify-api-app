import React, { Component } from 'react';
import './Playlists.css';

class Playlists extends Component {
  state = {
    playlists: null
  }

  componentDidMount() {
    const url = 'https://api.spotify.com';
    const { accessToken } = this.props;
    if (accessToken) this.fetchPlaylists(accessToken, url);
  }

  fetchPlaylists = async (accessToken, url) => {
    const res = await fetch(`${url}/v1/me/playlists`, {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
    const data = await res.json();
    this.setState({
      playlists: data.items.map(item => ({
        name: item.name,
        imageUrl: item.images.length > 0 && item.images[0].url
          ? item.images[0].url
          : './assets/Spotify_Icon.png'
      })
    )});
  }

  mapPlaylists = () => {
    const { playlists } = this.state;
    return playlists
      ? playlists.map((playlist, i) => {
        return (
          <div className='playlist-item' key={`playlist${i}`}>
            <p className="playlist-name">{playlist.name}</p>
            <img src={playlist.imageUrl} alt={playlist.name} className='playlist-image' />
          </div>
        )
      })
      : <h1>Loading playlists...</h1>
  }

  render() {
    return (
      <div className="playlist-container">
        <h3 className="playlists-title">Your playlists</h3>
        {this.mapPlaylists()}
      </div>
    )
  }
}

export default Playlists;