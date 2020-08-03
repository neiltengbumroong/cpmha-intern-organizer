import React, { Component } from 'react';
import axios from 'axios';
import Tasks from './Tasks';
import Interns from './Interns';
import Calendar from './Calendar';
import TaskForm from './TaskForm';

const TASK_URL = 'http://localhost:5000/tasks';
const INTERN_URL = 'http://localhost:5000/interns';

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
      <button onClick={() => this.changeMode('tasks')}>Tasks</button>
      <button onClick={() => this.changeMode('interns')}>Interns</button>
      <button onClick={() => this.changeMode('teams')}>Groups</button>
      <div>
        {this.state.display  === 'calendar' ? <Calendar/> :
         this.state.display === 'tasks' ? <Tasks/> :
         this.state.display === 'interns' ? <Interns/> :
         this.state.display === 'teams' ? <Interns/> : null}
      </div>
      </>
    )
  }
}

export default Home;