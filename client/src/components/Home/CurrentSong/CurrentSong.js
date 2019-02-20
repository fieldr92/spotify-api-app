import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCurrentSong } from '../../../actions';

class CurrentSong extends Component {
  componentDidMount() {
    const { accessToken, isSignedIn } = this.props;
    if (isSignedIn) {
      this.props.fetchCurrentSong(accessToken);
      setInterval(() => this.props.fetchCurrentSong(accessToken), 30000);
    }
  }

  displaySong() {
    const { currentSong } = this.props;
    const { item } = currentSong;
    return (
      <p>
        {`${item.name} by ${
          item.artists.length > 1
            ? this.multipleArtists(item.artists)
            : item.artists[0].name
        }`}
      </p>
    );
  }

  multipleArtists(artists) {
    const artistsArr = artists.map(artist => {
      return artist.name;
    });
    return artistsArr.join(' / ');
  }

  render() {
    const { songError, currentSong } = this.props;
    console.log(songError);
    if (songError || !currentSong) return <div>Loading.....</div>;
    return (
      <>
        <div style={{ textAlign: 'center' }}>
          <h2>Song currently playing:</h2>
          {this.displaySong()}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  accessToken: state.auth.userData.accessToken,
  isSignedIn: state.auth.isSignedIn,
  currentSong: state.music.song,
  songError: state.music.error
});

export default connect(
  mapStateToProps,
  { fetchCurrentSong }
)(CurrentSong);
