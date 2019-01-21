import React, { Component } from 'react';

class CurrentSong extends Component {
  state = {
    song: null
  };

  componentDidMount() {
    const { accessToken } = this.props;
    this.fetchCurrentSong(accessToken);
  }

  fetchCurrentSong = async accessToken => {
    const res = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: { Authorization: 'Bearer ' + accessToken }
      }
    );
    const data = await res.json();
    this.setState({
      song: data
    });
  };

  conditionalDisplaySong() {
    const { song } = this.state;
    if (song) {
      const { item } = song;
      return (
        <p>
          {`${item.name} by `}
          {item.artists.length > 1
            ? this.multipleArtists(item.artists)
            : item.artists[0].name}
        </p>
      );
    }
    return <div>Loading current song...</div>;
  }

  multipleArtists(artists) {
    const artistsArr = artists.map(artist => {
      return artist.name;
    });
    return artistsArr.join(' / ');
  }

  render() {
    return (
      <>
        <div style={{ textAlign: 'center' }}>
          <h2>Song currently playing:</h2>
          {this.conditionalDisplaySong()}
        </div>
      </>
    );
  }
}

export default CurrentSong;
