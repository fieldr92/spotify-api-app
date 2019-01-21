import React, { Component } from 'react';
import './TrackCard.css';

class TrackCard extends Component {
  state = {
    playing: false,
    active: false
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.playing !== prevState.playing)
      return { playing: nextProps.playing };
    return null;
  };

  handlePlayPause = () => {
    const { accessToken, uri, playing, active } = this.props;
    console.log('active', active);
    console.log('playing', playing);
    if (!playing) return this.playSong(accessToken, uri);
    return this.pauseSong(accessToken);
  };

  playSong = async (accessToken, uri) => {
    const url = 'https://api.spotify.com';
    const { setActiveSongState, active, i } = this.props;
    const { playing } = this.state;
    if (!playing) {
      console.log('playNewSong');
      try {
        const res = await fetch(`${url}/v1/me/player/play`, {
          method: 'PUT',
          headers: { Authorization: 'Bearer ' + accessToken },
          body: JSON.stringify({ uris: [uri] })
        });
        if (res.ok) {
          return setActiveSongState(!active, i);
        }
        throw new Error('Playback failed...');
      } catch (err) {
        return console.log(err.message);
      }
    }
    console.log('resumeSong');
    try {
      const res = await fetch(`${url}/v1/me/player/play`, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + accessToken }
      });
      if (res.ok) {
        return setActiveSongState(!active, i);
      }
      throw new Error('Playback failed...');
    } catch (err) {
      return console.log(err.message);
    }
  };

  pauseSong = async () => {
    const { accessToken, setActiveSongState, active, i } = this.props;
    const url = 'https://api.spotify.com';
    try {
      const res = await fetch(`${url}/v1/me/player/pause`, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + accessToken }
      });
      if (res.ok) {
        console.log('pauseSong');
        return setActiveSongState(active, i);
      }
      throw new Error('Pausing failed...');
    } catch (err) {
      console.log(err.message);
    }
  };

  render() {
    const { artists, name, album, albumArt, i } = this.props;

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
