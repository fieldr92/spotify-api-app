import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Playlists from './Playlists/Playlists';
import TopTracks from './TopTracks/TopTracks';
import './Home.css';

const Home = ({ userData }) => {
  const { accessToken } = userData;
  return (
    <Router>
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
          <Route
            path="/"
            exact
            render={() => <Playlists accessToken={accessToken} />}
          />
          <Route
            path="/toptracks"
            render={() => <TopTracks accessToken={accessToken} />}
          />
        </div>
      </>
    </Router>
  );
};

export default Home;
