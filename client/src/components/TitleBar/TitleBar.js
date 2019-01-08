import React from 'react';
import './TitleBar.css';

const TitleBar = ({ userData, clearUserData }) => {
  return (
    <div className='title-bar'>
      {/* <div className='title'>
      </div> */}
      <img className='title-logo' src='./assets/Spotify_Icon.png' alt='Logo' />
      <h1 className='title'>
        Ralph's Spotify App
      </h1>
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