import React from 'react';

const renderPlaylists = playlists => {
  return playlists
    ? playlists.map((playlist, i) => {
      return (
        <div style={{ display: 'inline-block', margin: '20px', textAlign: 'center' }} key={`playlist${i}`}>
          <h3>{playlist.name}</h3>
          <img src={playlist.imageUrl} alt={playlist.name} style={{ height: 300, width: 300 }} key={`playlist${i}`} />
        </div>
      )
    })
    : <h1>Loading playlists...</h1>
}

const Playlists = ({ userData, playlists, clearUserData }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <button onClick={() => {
        window.location = 'http://localhost:3000';
        clearUserData();
      }}>LOGOUT</button>
      <h1>Welcome to your Spotify, {userData.name}!</h1>
      {renderPlaylists(playlists)}
    </div>
  )
}

export default Playlists;