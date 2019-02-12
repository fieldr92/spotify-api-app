import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPlaylists } from '../../../actions';
import CurrentSong from '../CurrentSong/CurrentSong';
import './Playlists.css';

class Playlists extends Component {
  componentDidMount() {
    const url = 'https://api.spotify.com';
    const { accessToken } = this.props.userData;
    if (accessToken) this.props.fetchPlaylists(accessToken, url);
  }

  mapPlaylists = () => {
    const { playlists } = this.props;
    return playlists ? (
      playlists.map((playlist, i) => {
        return (
          <div className="playlist-item" key={`playlist${i}`}>
            <p className="playlist-name">{playlist.name}</p>
            <img
              src={playlist.imageUrl}
              alt={playlist.name}
              className="playlist-image"
            />
          </div>
        );
      })
    ) : (
      <h1>Loading playlists...</h1>
    );
  };

  render() {
    return (
      <>
        <CurrentSong />
        <div className="playlist-container">
          <h3 className="playlists-title">Your playlists</h3>
          {this.mapPlaylists()}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData: state.auth.userData,
    playlists: state.music.playlists
  };
};

export default connect(
  mapStateToProps,
  { fetchPlaylists }
)(Playlists);
