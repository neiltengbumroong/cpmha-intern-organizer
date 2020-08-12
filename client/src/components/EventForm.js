import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const EVENT_POST_API = 'http://localhost:5000/api/events/post';
const EVENT_UPDATE_API = 'http://localhost:5000/api/events/update';
const EVENT_GET_SINGLE_API = 'http://localhost:5000/api/events/get/single';


class EventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: '',
      start: '',
      end: '',
      description: ''
    }
  }

  handleEventChange = event => {
    this.setState({ event: event.target.value });
  }
  handleStartChange = date => {
    this.setState({ start: date});
  }
  handleEndChange = date => {
    this.setState({ end: date });
  }
  handleDescriptionChange = event => {
    this.setState({ description: event.target.value });
  }
  handleOpenModal = () => {
    this.setState({ showModal: true });
  }
  
  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  getEventData = () => {
    axios.post(EVENT_GET_SINGLE_API, { id: this.props.id })
      .then(res => {
        this.setState({
          event: res.data.event,
          start: res.data.start,
          end: res.data.end,
          description: res.data.description
        })
      })
  }

  createEvent = () => {
    const eventToCreate = {
      event: this.state.event,
      start: this.state.start,
      end: this.state.end,
      description: this.state.description,
    }
    axios.post(EVENT_POST_API, eventToCreate)
      .then(() => {
        this.props.loadData();
      })
      .catch(error => {
        this.setState({ error: true })
      })
      
    this.handleCloseModal();
  }

  editEvent = () => {
    const eventToUpdate = {
      id: this.props.id,
      event: this.state.event,
      start: this.state.start,
      end: this.state.end,
      description: this.state.description,
    }
    axios.post(EVENT_UPDATE_API, eventToUpdate);
    this.handleCloseModal();
    this.props.loadData();
    this.props.closeModal();
  }

  componentDidMount() {
    var newEnd = new Date();
    newEnd.setHours(newEnd.getHours() + 1);
    this.setState({
      start: new Date(),
      end: newEnd 
    });


    // load event data for editing
    if (this.props.type === 'edit') {
      this.getEventData();
    }
  }

  render() {
    return (
      <>
        <Button variant="info" onClick={this.handleOpenModal}>{this.props.type === 'edit' ? "Edit Event" : "Create Event"}</Button>
        <Modal
          show={this.state.showModal}
          onHide={this.handleCloseModal}
          keyboard={false}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title><h1>{this.props.type === 'edit' ? "Edit Event" : "New Event"}</h1></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>     
              <Form.Group>          
                <Form.Label>Event</Form.Label>
                <Form.Control 
                  size="md"
                  type="text" 
                  placeholder="Ex. Weekly Meeting"
                  defaultValue={this.props.type === 'edit' ? this.state.event : ''}  
                  onChange={this.handleEventChange}
                />
              </Form.Group>
              <Form.Row>
                <Col>
                <Form.Group>
                  <Form.Label>Start</Form.Label>
                  <DateTimePicker
                    onChange={this.handleStartChange}
                    value={new Date(this.state.start)}
                    disableClock={true}
                  />
                </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>End</Form.Label>
                    <DateTimePicker
                      onChange={this.handleEndChange}
                      value={new Date(this.state.end)}
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
                    defaultValue={this.props.type === 'edit' ? this.state.description : ''}  
                    onChange={this.handleDescriptionChange}
                  />          
              </Form.Group> 
              <Modal.Footer>
                <Button variant="info" type="button" onClick={this.handleCloseModal}>Close</Button>
                {this.props.type === 'edit' ?
                  <Button variant="primary" type="button" onClick={this.editEvent}>Save Changes</Button>
                  :        
                  <Button variant="primary" type="button" onClick={this.createEvent}>Create Event</Button>
                }         
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      </>   
    )
  }
}

export default EventForm;