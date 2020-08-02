import React, { Component } from 'react';
import axios from 'axios';
import Tasks from './Tasks';
import Interns from './Interns';


const INTERN_URL = 'http://localhost:5000/interns';

class Home extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div><Tasks/> <Interns/> </div>
      
    )
  }
}

export default Home;