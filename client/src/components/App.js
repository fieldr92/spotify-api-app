import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import TitleBar from './TitleBar/TitleBar';
import Home from './Home/Home';
import LoginPage from './LoginPage/LoginPage';
import './App.css';

class App extends Component {
  state = {
    userData: null
  };

  componentDidMount() {
    const url = 'https://api.spotify.com';
    if (!localStorage.getItem('access_token')) {
      if (new URLSearchParams(window.location.search).get('access_token')) {
        localStorage.setItem('access_token', new URLSearchParams(window.location.search).get('access_token'));
        localStorage.setItem('refresh_token', new URLSearchParams(window.location.search).get('refresh_token'));
        this.fetchUserData(url);
      }
    } else {
      this.fetchUserData(url);
    }
  }

  fetchUserData = async url => {
    const res = await fetch(`${url}/v1/me`, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token')}
    })
    const data = await this.tryResponseData(res, url);
    this.setState({ userData: {
      name: data.display_name,
      id: data.id,
      accessToken: localStorage.getItem('access_token')
    }});
    return data;
  }

  tryResponseData = (res, url) => {
    try {
      if (res.ok) return res.json();
      throw new Error('Access token expired...');
    } catch (err) {
      console.log(err.message);
      return this.refreshAccessToken(url);
    }
  }

  refreshAccessToken = async url => {
    console.log('Getting new access token...');
    const res = await fetch('http://localhost:8888/refresh_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: localStorage.getItem('refresh_token') })
    });
    const token = await res.json();
    const data = await this.setNewAccessToken(token, url);
    console.log('New access token received!');
    return data;
  }

  setNewAccessToken = (token, url) => {
    localStorage.setItem('access_token', token.access_token);
    return this.fetchUserData(url);
  }

  clearUserData = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.setState({ userData: null });
  }

  conditionalRender = userData => {
    if (!userData) return <LoginPage />
    return <Home
      userData={userData}
      clearUserData={this.clearUserData}
    />
  }

  render() {
    const { userData } = this.state;
    
    return <>
      <TitleBar
        userData={userData}
        clearUserData={this.clearUserData}
      />
      {this.conditionalRender(userData)}
    </>
  }
}

export default App;