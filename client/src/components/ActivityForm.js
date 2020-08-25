import React, { Component } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import moment from 'moment';
import { Form, Modal, Button } from 'react-bootstrap';

import * as API from '../utils/api';

class ActivityForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: 0,
      work: '',
      date: new Date(),
      showModal: false
    }
  }

  handleHoursChange = event => {
    this.setState({ hours: parseFloat(event.target.value) });
  }
  handleWorkChange = event => {
    if (event) {
      this.setState({ work: event.label });
    } else {
      this.setState({ work: ''});
    }
  }
  handleOpenModal = () => {
    this.setState({ showModal: true });
  }
  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  createActivity = () => {
    const workObject = {
      work: this.state.work,
      hours: this.state.hours,
      date: this.state.date
    }
    const newActivity = {
      id: this.props.internId,
      workObject: workObject
    }

    axios.post(API.INTERN_UPDATE_WORK_API, newActivity)
      .then(() => {
        this.handleCloseModal();
        this.props.updateParent();
      })
      // typical use case: user tries to log hours repeatedly after failing to 
      // load the new work hours, triggering an error with the express rate limiter. 
      // In this case, a simple page refresh should fix the issue
      .catch(error => {
        window.location.reload();
      }) 
  }

  render() {
    let options = [];

    this.props.tasks.forEach(task => {
      options.push({
        value: task._id,
        label: task.task
      })
    });

    return (
      <>
        <Button variant="info" onClick={this.handleOpenModal}>Log Hours</Button>
        <Modal
          show={this.state.showModal}
          onHide={this.handleCloseModal}
          keyboard={false}
          backdrop="static"
          size="lg"
        >
          <Modal.Header>Work Hours Form</Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  size="md"
                  type="text"
                  placeholder={this.props.name}     
                  readOnly
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  size="md"
                  type="text"
                  placeholder={moment(this.state.date).format('LLLL')}     
                  readOnly
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Select Task or Work</Form.Label>
                <CreatableSelect
                  isClearable
                  placeholder="Select or Type..."
                  onChange={this.handleWorkChange}
                  options={options}
                  isSearchable={true}
                />
                <Form.Text className="text-muted">
                  You can also type in your own work!
                </Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Hours Worked</Form.Label>
                <Form.Control
                  size="md"
                  type="number"
                  min="0.25"
                  placeholder="Ex. 0.5, 1.25, 2"
                  onChange={this.handleHoursChange}
                />
              </Form.Group>
            </Form>
            <Modal.Footer>
              <Button variant="danger" type="button" onClick={this.handleCloseModal}>Cancel</Button>
              <Button variant="primary" type="button" onClick={this.createActivity}>Log Hours</Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      </>
    )
  }
}

export default ActivityForm;