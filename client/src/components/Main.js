import React, { Component } from 'react';
import Tasks from './Tasks';
import Interns from './Interns';
import Teams from './Teams';

class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <> 
      <Tasks/>
      <Teams/>
      <Interns/>
      </>
    )
  }
}

export default Main;