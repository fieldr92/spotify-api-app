import React from 'react';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className='login-container'>
      <h1>Please login to access data...</h1>
      <button
        onClick={() => window.location='http://localhost:8888/login'}
        className='login-button'
      >
        Login to Spotify
      </button>
    </div>
  )
}

export default LoginPage;