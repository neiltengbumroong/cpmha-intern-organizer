import React, { Component } from 'react'
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import TaskForm from './TaskForm';
import EventForm from './EventForm';

const TASK_GET_API = 'http://localhost:5000/api/tasks/get';
const EVENT_GET_API = 'http://localhost:5000/api/events/get';

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      events: []
    }

    this.loadData = this.loadData.bind(this);
  }

  loadData() {
    axios.all([
      axios.get(TASK_GET_API),
      axios.get(EVENT_GET_API)
    ])
    .then(res => {
      this.setState({ 
        tasks: res[0].data,
        events: res[1].data
      })
    })
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    let tasksArr = [];
    let tasks = this.state.tasks;
    for (let i = 0; i < tasks.length; i++) {
      tasksArr.push({
        title: tasks[i].task,
        date: tasks[i].deadline.substring(0, 10)
      })
    }

    let eventsArr = [];
    let events = this.state.events;
    for (let i = 0; i < events.length; i++) {
      eventsArr.push({
        title: events[i].event,
        start: events[i].start,
        end: events[i].end
      })
    }

    let dataArr = tasksArr.concat(eventsArr);
    
    return (
      <>
        <TaskForm updateData={this.loadData.bind(this)}/>
        <EventForm updateData={this.loadData}/>
        <div style={{padding: "3% 8% 5%"}}>
          <FullCalendar
            plugins={[ dayGridPlugin ]}
            initialView="dayGridMonth"
            events={dataArr}
          />
        </div>
      </>         
    )
  }
}

export default Calendar;
