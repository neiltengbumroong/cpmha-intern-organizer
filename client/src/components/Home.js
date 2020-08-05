import React, { Component } from 'react';
import Calendar from './Calendar';
import Main from './Main';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 'calendar'
    }

    this.changeMode = this.changeMode.bind(this);
  }

  changeMode(mode) {
    this.setState({ display: mode })
  }

  render() {
    return (
      <>
      <button onClick={() => this.changeMode('calendar')}>Calendar</button>
      <button onClick={() => this.changeMode('main')}>Home</button>
      <div>
        {this.state.display  === 'calendar' ? <Calendar/> : <Main/>}
      </div>
      </>
    )
  }
}

export default Home;