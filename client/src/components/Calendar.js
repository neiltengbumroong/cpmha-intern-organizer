import React, { Component } from 'react'
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';
import interactionPlugin from "@fullcalendar/interaction";
import moment from 'moment';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import TaskForm from './TaskForm';
import EventForm from './EventForm';
import Header from './Header';

import * as API from '../utils/api';

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
      axios.get(API.TASK_GET_API),
      axios.get(API.EVENT_GET_API)
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
    axios.post(API.EVENT_DELETE_API, { id: this.state.eventId });
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
        eventStart: moment(event.start).format('LLLL'),
        eventEnd: moment(event.extendedProps.end).format('LLLL'),
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
        allDay: false,
        title: task.task,
        start: moment(task.deadline).toDate(),
        end: moment(task.deadline).toDate(),
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
    events.forEach(event => {
      eventsArr.push({
        allDay: false,
        title: event.event,
        start: event.start,
        end: event.end,
        color: '#5bc0de',
        extendedProps: {
          type: 'event',
          id: event._id,
          end: event.end,
          name: event.event,
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
              defaultTimedEventDuration='00:00'
              defaultAllDay={false}
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
                      <Row>
                        <Col xs={12}>
                          <h4>{this.state.eventName}</h4>
                          <p>{this.state.eventDescription}</p>
                          <p>Due by {this.state.eventEnd}</p>
                          <p style={{whiteSpace: "normal", wordWrap: "break-word"}}><a target="_blank" rel="noopener noreferrer" href={this.state.eventLink}>{this.state.eventLink}</a></p>
                        </Col>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="danger" type="button" onClick={this.handleCloseModal}>Close</Button>
                    </Modal.Footer>  
                  </>  
                  :
                  <>
                    <Modal.Body>
                      <Row>
                        <Col>
                          <h4>{this.state.eventName}</h4>
                          <p>{moment(this.state.eventStart).format('LLLL')} - {moment(this.state.eventEnd).format('LLLL')}</p>
                          <p>{this.state.eventDescription}</p>
                          <p style={{whiteSpace: "normal", wordWrap: "break-word"}}><a target="_blank" rel="noopener noreferrer" href={this.state.eventLink}>{this.state.eventLink}</a></p>
                        </Col>
                      </Row>
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
