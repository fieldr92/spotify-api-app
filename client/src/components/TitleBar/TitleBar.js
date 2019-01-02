import React from 'react';
import './TitleBar.css';

const TitleBar = ({ userData, clearUserData }) => {
  return (
    <div className='title-bar'>
      <div className='title'>
        {/* <img className='title-logo' src='https://developer.spotify.com/assets/branding-guidelines/icon1@2x.png' alt='Logo' /> */}
        <h1 className='title'>
          Ralph's Spotify App
        </h1>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => {
          window.location = 'http://localhost:3000';
          clearUserData();
        }}>
          Log Out
        </button>
      </div>
    </div>
  )
}

export default TitleBar;