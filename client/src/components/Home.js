import React, { Component } from 'react';
import Calendar from './Calendar';
import Main from './Main';

import '../css/Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 'main'
    }

    this.changeMode = this.changeMode.bind(this);
  }

  changeMode(mode) {
    this.setState({ display: mode })
  }

  render() {
    return (
      <div className="home-wrapper">
      <button onClick={() => this.changeMode('calendar')}>Calendar</button>
      <button onClick={() => this.changeMode('main')}>Home</button>
      <div>
        {this.state.display  === 'calendar' ? <Calendar/> : <Main/>}
      </div>
      </div>
    )
  }
}

export default Home;