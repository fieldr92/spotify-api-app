import React, { Component } from 'react';
import './TopTracks.css';

class TopTracks extends Component {
  state = {
    tracks: null
  }

  componentDidMount() {
    const url = 'https://api.spotify.com';
    const { accessToken } = this.props;
    if (accessToken) this.fetchTopTracks(accessToken, url);
  }

  fetchTopTracks = async (accessToken, url) => {
    const res = await fetch(`${url}/v1/me/top/tracks?limit=20&time_range=long_term`, {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })
    const data = await res.json();
    this.setState({
      tracks: data.items.map(item => ({
        artists: item.artists.map(artist => (artist.name)),
        name: item.name,
        album: item.album.name,
        albumArt: item.album.images[2].url
      })
    )});
  }

  mapTracks = () => {
    const { tracks } = this.state;
    if (tracks) {
      return tracks.map((track, i) => (
          <li className='track-list' key={`track${i}`}>
            {track.name} - {track.artists.length > 1 ? track.artists.join(' / ') : track.artists}
          </li>
        )
      );
    }
  }

  render() {
    return (
      <div className='track-container'>
        <h3 className="playlists-title" style={{ textAlign: 'center' }}>Your top tracks</h3>
        <ol>
          {this.mapTracks()}
        </ol>
      </div>
    )
  }
}

export default TopTracks;