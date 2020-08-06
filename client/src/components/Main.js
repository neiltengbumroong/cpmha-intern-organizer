import React, { Component } from 'react';
import Tasks from './Tasks';
import Interns from './Interns';
import Teams from './Teams';

import '../css/Main.css';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      update: true
    }

    this.updateMain = this.updateMain.bind(this);
  }

  updateMain() {
    this.setState({ update: true });
  }

  render() {
    return (
      <div className="main-wrapper"> 
        <div className="section-wrapper"><Tasks updateMain={this.updateMain}/></div>
        <div className="section-wrapper"><Teams updateMain={this.updateMain}/></div>
        <div className="section-wrapper"><Interns updateMain={this.updateMain}/></div>
      </div>
    )
  }
}

export default Main;