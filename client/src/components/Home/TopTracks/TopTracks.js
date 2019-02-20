import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchTopTracks, setActiveSongState } from '../../../actions';
import TrackCard from './TrackCard/TrackCard';
import './TopTracks.css';

class TopTracks extends Component {
  state = {
    timeRange: 'short_term'
  };

  componentDidMount() {
    const { accessToken, fetchTopTracks } = this.props;
    const { timeRange } = this.state;
    if (accessToken) fetchTopTracks(accessToken, timeRange);
  }

  componentDidUpdate(prevProps, prevState) {
    const { accessToken, fetchTopTracks } = this.props;
    const { timeRange } = this.state;
    if (prevState.timeRange !== this.state.timeRange)
      fetchTopTracks(accessToken, timeRange);
  }

  setValue = (key, value) => this.setState({ [key]: value });

  mapTrackCards = () => {
    const { accessToken, tracks, setActiveSongState } = this.props;
    if (tracks) {
      return tracks.map(({ id, ...track }, i) => (
        <TrackCard
          accessToken={accessToken}
          tracks={tracks}
          track={track}
          setActiveSongState={setActiveSongState}
          i={i}
          key={id}
        />
      ));
    }
  };

  render() {
    if (!this.props.tracks) return <div>Loading...</div>;
    return (
      <div className="track-container">
        <div className="top-selector">
          <h3 style={{ textAlign: 'center' }}>Your top tracks</h3>
          <select
            name="timeRange"
            onChange={e => this.setValue(e.target.name, e.target.value)}>
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
    accessToken: state.auth.userData.accessToken,
    tracks: state.music.tracks
  };
};

export default connect(
  mapStateToProps,
  { fetchTopTracks, setActiveSongState }
)(TopTracks);
