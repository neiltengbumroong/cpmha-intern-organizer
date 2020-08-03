import React, { Component } from 'react';
import axios from 'axios';
import Tasks from './Tasks';
import Interns from './Interns';
import Calendar from './Calendar';
import TaskForm from './TaskForm';

const TASK_URL = 'http://localhost:5000/tasks';
const INTERN_URL = 'http://localhost:5000/interns';

class Home extends Component {
  

  render() {
    return (
      <div>
        <Tasks/>
        <Calendar/>
      </div>
      
    )
  }
}

export default Home;