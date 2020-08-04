import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

import DateTimePicker from 'react-datetime-picker';

const EVENT_POST_API = 'http://localhost:5000/api/events/post';

class EventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: '',
      start: '',
      end: '',
      description: ''
    }

    this.handleEventChange = this.handleEventChange.bind(this);
    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);

    this.createEvent = this.createEvent.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);

  }

  handleEventChange(event) {
    this.setState({ event: event.target.value });
  }
  handleStartChange(date) {
    this.setState({ start: date});
  }
  handleEndChange(date) {
    this.setState({ end: date });
  }
  handleDescriptionChange(event) {
    this.setState({ dateAssigned: event.target.value });
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }
  
  handleCloseModal() {
    this.setState({ showModal: false });
  }

  createEvent() {
    const eventToCreate = {
      event: this.state.event,
      start: this.state.start,
      end: this.state.end,
      description: this.state.description,
    }

    axios.post(EVENT_POST_API, eventToCreate)
      .then(() => {
        this.props.updateData();
      })
      .catch(error => {
        this.setState({ error: true })
      })
      
    this.handleCloseModal();
    
  }

  render() {
    Modal.setAppElement('body');
    return (
      <>
        <button onClick={this.handleOpenModal}>Create Event</button>
        <Modal
          style={{
            content: {
              left: '20%',
              right: '20%',
              top: '15%',
              bottom: '15%',
            },
            overlay: {
              zIndex: '100'
            } 
          }}
          isOpen={this.state.showModal}
          contentLabel="Create Event Modal">
          <form>
            <h1>New Event</h1>
            <label htmlFor="event">
              Event: &nbsp;
              <input id="event" type="text" onChange={this.handleEventChange}/><br/>
            </label>
            <label htmlFor="start">
              <DateTimePicker
                onChange={this.handleStartChange}
                value={this.state.start}
                disableClock={true}
              />
            </label>
            <label htmlFor="end">
              <DateTimePicker
                onChange={this.handleEndChange}
                value={this.state.end}
                disableClock={true}
              />
            </label>           
            <label htmlFor="description">
              Description: &nbsp;
              <textarea id="description" onChange={this.handleDescriptionChange}/><br/>
            </label>          
            
            <button onClick={this.createEvent}>Create Event</button>
            <button onClick={this.handleCloseModal}>Close</button>
          </form>
        </Modal>
      </>   
    )
  }
}

export default EventForm;