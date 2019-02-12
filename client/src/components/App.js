import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUserData, clearUserData } from '../actions';
import TitleBar from './TitleBar/TitleBar';
import Home from './Home/Home';
import LoginPage from './LoginPage/LoginPage';
import './App.css';

class App extends Component {
  componentDidMount() {
    const url = 'https://api.spotify.com';
    const { search } = window.location;
    if (!localStorage.getItem('access_token')) {
      if (new URLSearchParams(search).get('access_token')) {
        localStorage.setItem(
          'access_token',
          new URLSearchParams(search).get('access_token')
        );
        localStorage.setItem(
          'refresh_token',
          new URLSearchParams(search).get('refresh_token')
        );
        this.props.fetchUserData(url);
      }
    } else {
      this.props.fetchUserData(url);
    }
  }

  conditionalRender = () => {
    const { userData } = this.props;
    if (!userData) return <LoginPage />;
    return <Home />;
  };

  render() {
    return (
      <>
        <TitleBar />
        {this.conditionalRender()}
      </>
    );
  }
}

const mapStateToProps = state => {
  const { userData } = state.auth;
  return {
    userData
  };
};

export default connect(
  mapStateToProps,
  { fetchUserData, clearUserData }
)(App);
