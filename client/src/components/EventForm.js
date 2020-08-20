import React, { Component } from 'react';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import * as API from '../utils/api';

class EventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: '',
      start: '',
      end: '',
      description: '',
      link: '',
      errors: [],
      showModal: false
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
  handleLinkChange = event => {
    this.setState({ link: event.target.value });
  }
  handleOpenModal = () => {
    this.setState({ showModal: true });
  }
  handleCloseModal = () => {
    this.setState({ showModal: false });
  }
  handleValidation = () => {
    let errors = {};
    if (!this.state.event) {
      errors["name"] = "Event name is required.";
    }
    if (!this.state.description) {
      errors["description"] = "Event description is required.";
    }

    this.setState({ errors: errors });

    if (errors["name"] || errors["description"]) {
      return false;
    } 
    return true;
  }

  getEventData = () => {
    axios.post(API.EVENT_GET_SINGLE_API, { id: this.props.id })
      .then(res => {
        this.setState({
          event: res.data.event,
          start: res.data.start,
          end: res.data.end,
          description: res.data.description,
          link: res.data.link
        })
      })
  }

  createEvent = async () => {
    const validated = await this.handleValidation();
    if (validated) {
      const eventToCreate = {
        event: this.state.event.trim(),
        start: this.state.start,
        end: this.state.end,
        description: this.state.description.trim(),
        link: this.state.link.trim()
      }
      axios.post(API.EVENT_POST_API, eventToCreate)
        .then(() => {
          this.props.loadData();
        })
        .catch(error => {
          this.setState({ error: true })
        })
        
      this.handleCloseModal();
    }
  }

  editEvent = async () => {
    const validated = await this.handleValidation();
    if (validated) {
      const eventToUpdate = {
        id: this.props.id,
        event: this.state.event.trim(),
        start: this.state.start,
        end: this.state.end,
        description: this.state.description.trim(),
        link: this.state.link.trim()
      }
      axios.post(API.EVENT_UPDATE_API, eventToUpdate);
      this.props.loadData();
      this.props.closeModal();
    }
  }

  componentDidMount() {
    // set time for date to be one hour past the current date
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
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title><h1>{this.props.type === 'edit' ? "Edit Event" : "New Event"}</h1></Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body ">
            <Form>     
              <Form.Group>          
                <Form.Label>Event</Form.Label>
                <Form.Control 
                  size="md"
                  type="text" 
                  maxLength="100"
                  placeholder="Ex. Weekly Meeting"
                  defaultValue={this.props.type === 'edit' ? this.state.event : ''}  
                  onChange={this.handleEventChange}
                  isInvalid={this.state.errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.errors["name"]}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control 
                    size="md"
                    type="text"
                    maxLength="500" 
                    placeholder="Ex. Go over weekly updates and progress"
                    defaultValue={this.props.type === 'edit' ? this.state.description : ''}  
                    onChange={this.handleDescriptionChange}
                    isInvalid={this.state.errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.errors["description"]}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Row>
                <Col lg={6} md={12}>
                  <Form.Group>
                    <Form.Label>Start &nbsp;</Form.Label>
                    <DateTimePicker
                      onChange={this.handleStartChange}
                      value={new Date(this.state.start)}
                      disableClock={true}
                      clearIcon={null}
                    />
                  </Form.Group>
                </Col>
                <Col lg={6} md={12}>
                  <Form.Group>
                    <Form.Label>End &nbsp;</Form.Label>
                    <DateTimePicker
                      onChange={this.handleEndChange}
                      value={new Date(this.state.end)}
                      disableClock={true}
                      clearIcon={null}
                    />
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Group>
                <Form.Label>Link</Form.Label>
                  <Form.Control 
                    size="md"
                    type="text" 
                    placeholder="Ex. Zoom Link"
                    defaultValue={this.props.type === 'edit' ? this.state.link : ''}  
                    onChange={this.handleLinkChange}
                  />          
              </Form.Group> 
              <Modal.Footer>
                <Button variant="danger" type="button" onClick={this.handleCloseModal}>Close</Button>
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