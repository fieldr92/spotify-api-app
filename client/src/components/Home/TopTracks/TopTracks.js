import React, { Component } from 'react';
import TrackCard from './TrackCard/TrackCard';
import './TopTracks.css';

class TopTracks extends Component {
  state = {
    tracks: null,
    optionValue: 'short_term',
    playing: false
  };

  componentDidMount() {
    const { accessToken } = this.props;
    if (accessToken) this.fetchTopTracks(accessToken);
  }

  handleSelect = e => {
    const { accessToken } = this.props;
    this.setState({ optionValue: e.target.value }, () =>
      this.fetchTopTracks(accessToken)
    );
  };

  fetchTopTracks = async accessToken => {
    const url = 'https://api.spotify.com';
    const { optionValue } = this.state;
    const res = await fetch(
      `${url}/v1/me/top/tracks?limit=20&time_range=${optionValue}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const data = await res.json();
    this.setState({
      tracks: data.items.map(({ artists, name, album, id, uri }) => ({
        artists: artists.map(artist => artist.name),
        name,
        id,
        album: album.name,
        albumArt: album.images[1].url,
        uri,
        active: false
      }))
    });
  };

  setActiveSongState = (active, i) => {
    const { tracks } = this.state;
    console.log('setActive', active);
    this.setState({
      tracks: tracks.map((track, index) => {
        const copyTrack = { ...track };
        if (index === i) {
          if (active) {
            copyTrack.active = true;
            this.setState({ playing: true });
            return copyTrack;
          }
          copyTrack.active = false;
          this.setState({ playing: false });
          return copyTrack;
        }
        copyTrack.active = false;
        return copyTrack;
      })
    });
  };

  mapTrackCards = () => {
    const { tracks, playing } = this.state;
    const { accessToken } = this.props;
    if (tracks) {
      return tracks.map(
        ({ artists, name, id, album, albumArt, uri, active }, i) => (
          <TrackCard
            artists={artists}
            name={name}
            album={album}
            albumArt={albumArt}
            i={i}
            accessToken={accessToken}
            uri={uri}
            active={active}
            playing={playing}
            setActiveSongState={this.setActiveSongState}
            key={id}
          />
        )
      );
    }
  };

  render() {
    return (
      <div className="track-container">
        <div className="top-selector">
          <h3 style={{ textAlign: 'center' }}>Your top tracks</h3>
          <select value={this.state.value} onChange={this.handleSelect}>
            <option value="short_term">Past 4 weeks</option>
            <option value="medium_term">Past 6 months</option>
            <option value="long_term">Past year</option>
          </select>
        </div>
        <div className="track-card-container">{this.mapTrackCards()}</div>
      </div>
    );
  }
}

export default TopTracks;
