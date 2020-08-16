import React, { Component } from 'react';
import axios from 'axios';
import { Form, Col, Button, Modal } from 'react-bootstrap';

const ANNOUNCE_POST_API = 'http://localhost:5000/api/announcements/post';

class AnnounceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: '',
      name: '',
      announcement: '',
      showModal: false
    }
  }

  handleSubjectChange = event => {
    this.setState({ subject: event.target.value });
  }
  handleNameChange = event => {
    this.setState({ name: event.target.value });
  }
  handleAnnouncementChange = event => {
    this.setState({ announcement: event.target.value });
  }
  handleOpenModal = () => {
    this.setState({ showModal: true });
  }
  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  saveAnnouncement = () => {
    const newAnnounce = {
      subject: this.state.subject,
      name: this.state.name,
      announcement: this.state.announcement,
      date: new Date()
    }
    axios.post(ANNOUNCE_POST_API, newAnnounce)
      .then(res => {
        console.log(res);
      })
    this.handleCloseModal();
  }

  render() {
    return (
      <>
        <Button onClick={this.handleOpenModal}>New Announcement</Button>
        <Modal 
          show={this.state.showModal}
          onHide={this.handleCloseModal}
          keyboard={false}
          backdrop="static"
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>New Announcement</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control 
                  size="md"
                  type="text" 
                  placeholder="John Doe"
                  onChange={this.handleNameChange}
                />
              </Form.Group>         
              <Form.Group>
                <Form.Label>Subject</Form.Label>
                <Form.Control 
                  size="md"
                  type="text" 
                  placeholder="Weekly Reminder"
                  onChange={this.handleSubjectChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Announcement</Form.Label>
                <Form.Control 
                  size="md"
                  as="textarea" 
                  placeholder="Update for this week, etc..."
                  onChange={this.handleAnnouncementChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" type="button" onClick={this.handleCloseModal}>Cancel</Button>
            <Button variant="primary" type="button" onClick={this.saveAnnouncement}>Post Announcement</Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }


}

export default AnnounceForm;