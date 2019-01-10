import React from 'react';
import './LoginPage.css';

// let quote = null;
// let character = null;

// const getSimpQuote = () => {
//   return fetch('https://thesimpsonsquoteapi.glitch.me/quotes')
//   .then(res => console.log(res))
//   .then(res => res.json())
//   .then(data => {
//     quote = data.quote;
//     character = data.character;
//   })
// }

const LoginPage = () => {
  return (
    <div className='login-container'>
      <h1>Please login to access data...</h1>
      {/* <button
        onClick={() => window.location='http://localhost:8888/login'}
        className='login-button'
      >
        Login to Spotify
      </button> */}
      {/* <p style={{ color: 'white' }}>
        {quote}
      </p> */}
    </div>
  )
}

export default LoginPage;