import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

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

  componentDidMount() {
    var newEnd = new Date();
    newEnd.setHours(newEnd.getHours() + 1);
    this.setState({
      start: new Date(),
      end: newEnd 
    });
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
          <Form>
            <h1>New Event</h1>
            <Form.Group>          
              <Form.Label>Event</Form.Label>
              <Form.Control 
                size="md"
                type="text" 
                placeholder="Ex. Weekly Meeting"
                // defaultValue={this.props.type === 'edit' ? this.props.name : ''}  
                onChange={this.handleEventChange}
              />
            </Form.Group>

            <Form.Row>
              <Col>
              <Form.Group>
                <Form.Label>Start</Form.Label>
                <DateTimePicker
                  onChange={this.handleStartChange}
                  value={this.state.start}
                  disableClock={true}
                />
              </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>End</Form.Label>
                  <DateTimePicker
                    onChange={this.handleEndChange}
                    value={this.state.end}
                    disableClock={true}
                  />
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Group>
              <Form.Label>Description</Form.Label>
                <Form.Control 
                  size="md"
                  type="text" 
                  placeholder="Ex. Go over weekly updates and progress"
                  // defaultValue={this.props.type === 'edit' ? this.props.name : ''}  
                  onChange={this.handleDescriptionChange}
                />          
            </Form.Group>         
            <button onClick={this.createEvent}>Create Event</button>
            <button onClick={this.handleCloseModal}>Close</button>
          </Form>
        </Modal>
      </>   
    )
  }
}

export default EventForm;