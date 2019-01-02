import React from 'react';
import './Playlists.css';

const renderPlaylists = playlists => {
  return playlists
    ? playlists.map((playlist, i) => {
      return (
        <div className='playlist-item' key={`playlist${i}`}>
          <p className="playlist-name">{playlist.name}</p>
          <img src={playlist.imageUrl} alt={playlist.name} className='playlist-image' key={`playlist${i}`} />
        </div>
      )
    })
    : <h1>Loading playlists...</h1>
}

const Playlists = ({ userData, playlists }) => {
  return (
    <>
      <div className="playlist-container">
        <h3 className="playlists-title">Your playlists</h3>
        {renderPlaylists(playlists)}
      </div>
    </>
  )
}

export default Playlists;