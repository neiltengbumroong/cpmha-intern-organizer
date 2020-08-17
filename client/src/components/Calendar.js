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
      eventType: '',
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
    if (event.extendedProps.type === 'task') {
      this.setState({
        eventType: event.extendedProps.type,
        eventName: event.title,
        eventEnd: moment(event.extendedProps.deadline).format('LLLL'),
        eventDescription: event.extendedProps.description,
        eventLink: event.extendedProps.link,
        showModal: true
      });
    } else {
      this.setState({
        eventType: event.extendedProps.type,
        eventId: event.extendedProps.id,
        eventName: event.extendedProps.name,
        eventStart: event.start,
        eventEnd: event.end,
        eventDescription: event.extendedProps.description,
        eventLink: event.extendedProps.link,
        showModal: true 
      });
    }
  }

  render() {
    let tasksArr = [];
    let tasks = this.state.tasks;
    tasks.forEach(task => {
      tasksArr.push({
        title: task.task,
        start: moment(task.deadline).format(EVENT_FORMAT),
        end: moment(task.deadline).format(EVENT_FORMAT),
        color: 'rgb(71,55,193)',
        extendedProps: {
          type: 'task',
          id: task._id,
          description: task.description,
          link: task.link,
          deadline: task.deadline
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
        color: '#5bc0de',
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
      <div className="main-background">
        <Header/>
        <div className="calendar-wrapper">
          <TaskForm updateParent={this.loadData} type='create'/>
          <EventForm loadData={this.loadData} />
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
            />
            <Modal
              show={this.state.showModal}
              onHide={this.handleCloseModal}
              keyboard={false}
              backdrop="static"
            >
              <Modal.Header closeButton>
                <Modal.Title>{this.state.eventType === 'task' ? "Task Information" : "Event Information"}</Modal.Title>
              </Modal.Header>
              
                {this.state.eventType === 'task' ?
                  <>
                    <Modal.Body>
                      <div>
                        <h4>{this.state.eventName}</h4>
                        <p>Due by {this.state.eventEnd}</p>
                        <p>{this.state.eventDescription}</p>
                        <a target="_blank" rel="noopener noreferrer" href={this.state.eventLink}>{this.state.eventLink}</a>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="danger" type="button" onClick={this.handleCloseModal}>Close</Button>
                    </Modal.Footer>  
                  </>  
                  :
                  <>
                    <Modal.Body>
                      <div>
                        <h4>{this.state.eventName}</h4>
                        <p>{moment(this.state.eventStart).format('LLLL')} - {moment(this.state.eventEnd).format('LLLL')}</p>
                        <p>{this.state.eventDescription}</p>
                        <a target="_blank" rel="noopener noreferrer" href={this.state.eventLink}>{this.state.eventLink}</a>
                      </div>
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
                  </>}        
            </Modal>
          </div>
        </div>  
      </div>       
    )
  }
}

export default Calendar;
