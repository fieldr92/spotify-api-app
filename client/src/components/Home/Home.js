import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Route, Link } from 'react-router-dom';
import Playlists from './Playlists/Playlists';
import TopTracks from './TopTracks/TopTracks';
import history from '../../history';
import './Home.css';

class Home extends Component {
  render() {
    const { userData } = this.props;
    return (
      <Router history={history}>
        <>
          <div className="route-menu">
            <ul className="route-list">
              <li>
                <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/toptracks"
                  style={{ textDecoration: 'none', color: 'white' }}>
                  Your Top Tracks
                </Link>
              </li>
            </ul>
          </div>
          <h1 style={{ width: '100%', textAlign: 'center' }}>
            Welcome to your Spotify, {userData.name}!
          </h1>
          <div className="container">
            <Route path="/" exact render={() => <Playlists />} />
            <Route path="/toptracks" exact render={() => <TopTracks />} />
          </div>
        </>
      </Router>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData: state.auth.userData
  };
};

export default connect(mapStateToProps)(Home);
