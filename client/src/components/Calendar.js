import React, { Component } from 'react'
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import TaskForm from './TaskForm';

const TASK_URL = 'http://localhost:5000/tasks';

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
    }

    this.loadTasks = this.loadTasks.bind(this);
  }

  loadTasks() {
    axios.get(TASK_URL)
    .then(res => {
      this.setState({ tasks: res.data })
    })
  }

  componentDidMount() {
    this.loadTasks();
  }

  render() {
    let tasksArr = [];
    let tasks = this.state.tasks;
    for (let i = 0; i < tasks.length; i++) {
      tasksArr.push({
        title: tasks[i].name,
        date: tasks[i].deadline.substring(0, 10)
      })
    }
    
    return (
      <>
        <TaskForm/>
        <div style={{padding: "3% 8% 5%"}}>
          <FullCalendar
            plugins={[ dayGridPlugin ]}
            initialView="dayGridMonth"
            events={tasksArr}
          />
        </div>
      </>         
    )
  }
}

export default Calendar;
