import React, { Component } from 'react';
import Tasks from './Tasks';
import Interns from './Interns';
import Teams from './Teams';

import '../css/Main.css';

class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="main-wrapper"> 
        <div className="section-wrapper"><Tasks/></div>
        <div className="section-wrapper"><Teams/></div>
        <div className="section-wrapper"><Interns/></div>
      </div>
    )
  }
}

export default Main;