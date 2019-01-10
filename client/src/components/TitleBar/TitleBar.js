import React from 'react';
import './TitleBar.css';

const loginLogout = (userData, clearUserData) => {
  if (!userData) {
    return <button
      onClick={() => window.location='http://localhost:8888/login'}
      className='login-button'
    >
      Log In
    </button>
  }
  return <button onClick={() => {
    // window.location = 'http://localhost:3000';
    clearUserData();
  }}>
    Log Out
  </button>
}

const TitleBar = ({ userData, clearUserData }) => {
  return (
    <div className='title-bar'>
      <img className='title-logo' src='./assets/Spotify_Icon.png' alt='Logo' />
      <h1 className='title'>
        Ralph's Spotify App
      </h1>
      <div style={{ textAlign: 'center' }}>
        {loginLogout(userData, clearUserData)}
      </div>
    </div>
  )
}

export default TitleBar;