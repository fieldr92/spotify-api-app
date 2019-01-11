import React, { Component } from 'react';
import './LoginPage.css';

class LoginPage extends Component {
  _isMounted = false;
  
  state = {
    quote: null,
    character: null
  }

  componentDidMount() {
    this._isMounted = true;
    this.getSimpQuote();
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  getSimpQuote = async () => {
    const res = await fetch('https://thesimpsonsquoteapi.glitch.me/quotes');
    const data = await res.json();
    if (this._isMounted) this.setState({
      quote: data[0].quote,
      character: data[0].character
    })
  }

  render() {
    const { quote, character } = this.state;

    return <>
      { this.state.quote
        ? <div className='login-container'>
          <h2 style={{ color: 'white', margin: '5px', marginTop: '50px' }}>
            {quote}
          </h2>
          <p style={{ color: 'white', margin: '5px' }}>
            {character}
          </p>
        </div>
        : <div className='login-container'></div>
      }
    </>
  }
}

export default LoginPage;