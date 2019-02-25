import React, { Component } from 'react';
import './TrackCard.css';

class TrackCard extends Component {
  state = {
    playing: false,
    trackIndex: null
  };

  componentDidUpdate(prevProps, prevState) {
    const { playing, trackIndex } = this.state;
    const { setActiveSongState, tracks } = this.props;
    if (prevState.playing !== playing && playing === true)
      setActiveSongState(tracks, true, trackIndex);
    if (prevState.playing !== playing && playing === false)
      setActiveSongState(tracks, true, trackIndex);
  }

  handlePlayPause = () => {
    const { accessToken, i } = this.props;
    const { uri, active } = this.props.track;
    const { playing } = this.state;
    if (!active) return this.playNewSong(accessToken, uri, i);
    if (active && !playing) return this.resumeSong(accessToken);
    return this.pauseSong(accessToken, i);
  };

  playNewSong = async (accessToken, uri, trackIndex) => {
    const url = 'https://api.spotify.com';
    try {
      const res = await fetch(`${url}/v1/me/player/play`, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + accessToken },
        body: JSON.stringify({ uris: [uri] })
      });
      if (res.ok) return this.setState({ playing: true, trackIndex });
      throw new Error('New song playback failed...');
    } catch (err) {
      console.log(err.message);
    }
  };

  resumeSong = async accessToken => {
    const url = 'https://api.spotify.com';
    try {
      const res = await fetch(`${url}/v1/me/player/play`, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + accessToken }
      });
      if (res.ok) return this.setState({ playing: true });
      throw new Error('Resume playback failed...');
    } catch (err) {
      console.log(err.message);
    }
  };

  pauseSong = async (accessToken, trackIndex) => {
    const url = 'https://api.spotify.com';
    try {
      const res = await fetch(`${url}/v1/me/player/pause`, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + accessToken }
      });
      if (res.ok) return this.setState({ playing: false, trackIndex });
      throw new Error('Pausing failed...');
    } catch (err) {
      console.log(err.message);
    }
  };

  render() {
    const { artists, name, album, albumArt } = this.props.track;
    return (
      <tr className="track-row">
        <td className="album-art">
          <img
            src={albumArt}
            alt={`Album Art for ${album}`}
            onClick={this.handlePlayPause}
          />
        </td>
        <td className="track-info">{`${name}`}</td>
        <td className="track-info">
          {artists.length > 1 ? artists.join(' / ') : artists}
        </td>
        <td className="track-info">{album}</td>
      </tr>
    );
  }
}

export default TrackCard;
