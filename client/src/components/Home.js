import React, { Component } from 'react';
import Calendar from './Calendar';
import Header from './Header';
import Main from './Main';
import { Link } from "react-router-dom";

import '../css/Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }

    this.changeMode = this.changeMode.bind(this);
  }

  changeMode(mode) {
    this.setState({ display: mode })
  }

  render() {
    return (
      <>
        <Header/>
        <Main/>
      </>
    )
  }
}

export default Home;