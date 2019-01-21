import React, { Component } from 'react';
import './TrackCard.css';

class TrackCard extends Component {
  state = {
    playing: false
  };

  handlePlayPause = () => {
    const { accessToken, i } = this.props;
    const { uri, active } = this.props.track;
    const { playing } = this.state;
    if (!active) return this.playNewSong(accessToken, active, uri, i);
    if (active && !playing) return this.resumeSong(accessToken, active, i);
    return this.pauseSong(accessToken, active, i);
  };

  playNewSong = async (accessToken, active, uri, i) => {
    const url = 'https://api.spotify.com';
    const { setActiveSongState } = this.props;
    try {
      const res = await fetch(`${url}/v1/me/player/play`, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + accessToken },
        body: JSON.stringify({ uris: [uri] })
      });
      if (res.ok) {
        return this.setState({ playing: true }, setActiveSongState(!active, i));
      }
      throw new Error('New song playback failed...');
    } catch (err) {
      return console.log(err.message);
    }
  };

  resumeSong = async accessToken => {
    const url = 'https://api.spotify.com';
    try {
      const res = await fetch(`${url}/v1/me/player/play`, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + accessToken }
      });
      if (res.ok) {
        return this.setState({ playing: true });
      }
      throw new Error('Resume playback failed...');
    } catch (err) {
      return console.log(err.message);
    }
  };

  pauseSong = async (accessToken, active, i) => {
    const { setActiveSongState } = this.props;
    const url = 'https://api.spotify.com';
    try {
      const res = await fetch(`${url}/v1/me/player/pause`, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + accessToken }
      });
      if (res.ok) {
        return this.setState({ playing: false }, setActiveSongState(active, i));
      }
      throw new Error('Pausing failed...');
    } catch (err) {
      console.log(err.message);
    }
  };

  render() {
    const { i } = this.props;
    const { artists, name, album, albumArt } = this.props.track;

    return (
      <>
        <div className="track-card">
          <img
            src={albumArt}
            alt={`Album Art for ${album}`}
            onClick={this.handlePlayPause}
          />
          <div className="track-info">
            <h2>{`${i + 1}. ${name}`}</h2>
            <p>{artists.length > 1 ? artists.join(' / ') : artists}</p>
            <p>{album}</p>
          </div>
        </div>
      </>
    );
  }
}

export default TrackCard;
