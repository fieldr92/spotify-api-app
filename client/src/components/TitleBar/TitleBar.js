import React, { Component } from 'react';
import { connect } from 'react-redux';
import { clearUserData } from '../../actions';
import history from '../../history';
import './TitleBar.css';

class TitleBar extends Component {
  loginLogout = userData => {
    if (!userData) {
      return (
        <button
          onClick={() => (window.location = 'http://localhost:8888/login')}
          className="login-button">
          Log In
        </button>
      );
    }
    return (
      <button
        onClick={() => {
          history.push('/');
          this.props.clearUserData();
        }}>
        Log Out
      </button>
    );
  };

  render() {
    const { userData } = this.props;
    return (
      <>
        <div className="title-bar">
          <img
            className="title-logo"
            src="./assets/Spotify_Icon.png"
            alt="Logo"
          />
          <h1 className="title">Ralph's Spotify App</h1>
          <div style={{ textAlign: 'center' }}>
            {this.loginLogout(userData)}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData: state.auth.userData
  };
};

export default connect(
  mapStateToProps,
  { clearUserData }
)(TitleBar);
