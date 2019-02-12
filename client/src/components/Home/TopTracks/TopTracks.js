import React, { Component } from 'react';
import { connect } from 'react-redux';
import TrackCard from './TrackCard/TrackCard';
import history from '../../../history';
import './TopTracks.css';

class TopTracks extends Component {
  state = {
    tracks: null,
    optionValue: 'short_term'
  };

  componentDidMount() {
    const { accessToken } = this.props.userData;
    if (accessToken) this.fetchTopTracks(accessToken);
  }

  handleSelect = e => {
    const { accessToken } = this.props.userData;
    this.setState({ optionValue: e.target.value }, () =>
      this.fetchTopTracks(accessToken)
    );
  };

  fetchTopTracks = async accessToken => {
    try {
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
          playing: false,
          active: false
        }))
      });
    } catch (err) {
      console.log(err);
      history.push('/');
    }
  };

  setActiveSongState = (active, i) => {
    const { tracks } = this.state;
    this.setState({
      tracks: tracks.map((track, index) => {
        const copyTrack = { ...track };
        if (index === i) {
          if (active) {
            copyTrack.active = true;
            return copyTrack;
          }
          copyTrack.active = false;
          return copyTrack;
        }
        copyTrack.active = false;
        return copyTrack;
      })
    });
  };

  mapTrackCards = () => {
    const { tracks } = this.state;
    const { accessToken } = this.props.userData;
    if (tracks) {
      return tracks.map(({ id, ...track }, i) => (
        <TrackCard
          accessToken={accessToken}
          track={track}
          setActiveSongState={this.setActiveSongState}
          i={i}
          key={id}
        />
      ));
    }
  };

  render() {
    if (!this.state.tracks) return <div>Loading...</div>;
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
        <table cellSpacing="1">
          <thead className="table-head">
            <tr>
              <th>Play Song</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
            </tr>
          </thead>
          <tbody>{this.mapTrackCards()}</tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData: state.auth.userData
  };
};

export default connect(mapStateToProps)(TopTracks);
