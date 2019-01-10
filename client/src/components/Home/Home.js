import React from 'react';
import Playlists from './Playlists/Playlists';
import TopTracks from './TopTracks/TopTracks';
import './Home.css';

const Home = ({ userData, clearUserData }) => {
  return (
    <>
      <h1 style={{ width: '100%', textAlign: 'center' }}>Welcome to your Spotify, {userData.name}!</h1>
      <div className='playlist-toptracks'>
        <Playlists
          accessToken={userData.accessToken}
          clearUserData={clearUserData}
        />
        <TopTracks accessToken={userData.accessToken} />
      </div>
    </>
  )
}

export default Home;