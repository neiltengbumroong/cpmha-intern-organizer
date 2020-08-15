import React, { Component } from 'react'
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import interactionPlugin from "@fullcalendar/interaction";
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import TaskForm from './TaskForm';
import EventForm from './EventForm';
import { Link } from 'react-router-dom';
import Header from './Header';

import '../css/Calendar.css';

const TASK_GET_API = 'http://localhost:5000/api/tasks/get';
const EVENT_GET_API = 'http://localhost:5000/api/events/get';
const EVENT_DELETE_API = 'http://localhost:5000/api/events/delete';

const EVENT_FORMAT = 'YYYY-MM-DD HH:MM';

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: '',
      eventName: '',
      eventStart: '',
      eventEnd: '',
      eventDescription: '',
      eventLink: '',
      tasks: [],
      events: []
    }

  }

  handleOpenModal = () => {
    this.setState({ showModal: true });
  }
  
  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  loadData = () => {
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

  deleteEvent = () => {
    axios.post(EVENT_DELETE_API, { id: this.state.eventId });
    this.loadData();
    this.handleCloseModal();
  }

  handleEventClick = ({event}) => {
    this.setState({ 
      eventId: event.extendedProps.id,
      eventName: event.extendedProps.name,
      eventStart: event.extendedProps.start,
      eventEnd: event.extendedProps.end,
      eventDescription: event.extendedProps.description,
      eventLink: event.extendedProps.link,
      showModal: true 
    });
  }

  showEvent = () => {

  }

  render() {
    let tasksArr = [];
    let tasks = this.state.tasks;
    tasks.forEach(task => {
      tasksArr.push({
        title: task.task,
        start: moment(task.deadline).format(EVENT_FORMAT),
        end: moment(task.deadline).format(EVENT_FORMAT),
        extendedProps: {
          type: 'task',
          id: task._id
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
          type: 'event',
          id: event._id,
          name: event.event,
          start: event.start,
          end: event.end,
          description: event.description,
          link: event.link
        }
      })
    })

    let dataArr = tasksArr.concat(eventsArr);
    
    return (
      <>
      <Header/>
      <div className="calendar-wrapper">
        <TaskForm updateData={this.loadData.bind(this)}/>
        <EventForm loadData={this.loadData}/>
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
            eventClick={this.handleEventClick}
            eventDidMount={this.showEvent}
          />
          <Modal
            show={this.state.showModal}
            onHide={this.handleCloseModal}
            keyboard={false}
            backdrop="static"
          >
            <Modal.Header closeButton>
              <Modal.Title>Event Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4>{this.state.eventName}</h4>
              <p>{moment(this.state.eventStart).format('MMMM Do YYYY, h:mm a')} - {moment(this.state.eventEnd).format('MMMM Do YYYY, h:mm a')}</p>
              <p>{this.state.eventDescription}</p>
              <a target="_blank" rel="noopener noreferrer" href={this.state.eventLink}>{this.state.eventLink}</a>
            </Modal.Body>
            <Modal.Footer>
              <EventForm 
                type={"edit"}
                id={this.state.eventId}
                closeModal={this.handleCloseModal}
                loadData={this.loadData}
              />
              <Button variant="danger" type="button" onClick={this.deleteEvent}>Delete Event</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>  
      </>       
    )
  }
}

export default Calendar;
