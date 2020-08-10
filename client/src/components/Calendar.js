import React, { Component } from 'react'
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import interactionPlugin from "@fullcalendar/interaction";
import moment from 'moment';
import TaskForm from './TaskForm';
import EventForm from './EventForm';

import '../css/Calendar.css';

const TASK_GET_API = 'http://localhost:5000/api/tasks/get';
const EVENT_GET_API = 'http://localhost:5000/api/events/get';

const EVENT_FORMAT = 'YYYY-MM-DD HH:MM';

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

  alertEvent = () => {
    alert("hello");
  }

  showEvent = () => {

  }

  render() {
    let tasksArr = [];
    let tasks = this.state.tasks;
    tasks.forEach(task => {
      tasksArr.push({
        id: task._id,
        title: task.task,
        start: moment(task.deadline).format(EVENT_FORMAT),
        end: moment(task.deadline).format(EVENT_FORMAT),
        extendedProps: {
          type: 'task'
        }
      })
    })

    let eventsArr = [];
    let events = this.state.events;
    events.forEach(event =>  {
      eventsArr.push({
        title: event.event,
        start: event.start,
        end: event.end,
        extendedProps: {
          type: 'event'
        }
      })
    })

    let dataArr = tasksArr.concat(eventsArr);
    
    return (
      <div className="calendar-wrapper">
        <TaskForm updateData={this.loadData.bind(this)}/>
        <EventForm updateData={this.loadData}/>
        <div style={{padding: "5%"}}>
          <FullCalendar
            plugins={[ interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin ]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
            }}
            events={dataArr}
            eventClick={this.alertEvent}
            eventDidMount={this.showEvent}
          />
        </div>
      </div>         
    )
  }
}

export default Calendar;
