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
      showModal: false,
      errors: []
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
  handleValidation = () => {
    let errors = {};
    if (!this.state.name) {
      errors["name"] = "Announcer name is required.";
    }
    if (!this.state.subject) {
      errors["subject"] = "Announcement subject is required.";
    }
    if (!this.state.announcement || this.state.announcement.length < 20) {
      errors["announcement"] = "Announcement text must be at least 20 characters.";
    }

    this.setState({ errors: errors });

    if (errors["name"] || errors["subject"] || errors["announcement"]) {
      return false;
    } 
    return true;
  }

  saveAnnouncement = async () => {
    const validated = await this.handleValidation();
    if (validated) {
      const newAnnounce = {
        subject: this.state.subject,
        name: this.state.name,
        announcement: this.state.announcement,
        date: new Date()
      }
      axios.post(ANNOUNCE_POST_API, newAnnounce)
        .then(() => {
          this.props.updateMain();
        })
      this.handleCloseModal();
    }
  }

  render() {
    return (
      <>
        <Button variant="cpmha-dark-purple" className="btn-xs" onClick={this.handleOpenModal}>New Announcement</Button>
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
                  maxLength="20"
                  size="md"
                  type="text" 
                  placeholder="John Doe"
                  onChange={this.handleNameChange}
                  isInvalid={this.state.errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.errors["name"]}
                </Form.Control.Feedback>       
              </Form.Group>           
              <Form.Group>
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  maxLength="50"
                  size="md"
                  type="text" 
                  placeholder="Weekly Reminder"
                  onChange={this.handleSubjectChange}
                  isInvalid={this.state.errors.subject}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.errors["subject"]}
                </Form.Control.Feedback>
              </Form.Group>         
              <Form.Group>
                <Form.Label>Announcement</Form.Label>
                <Form.Control 
                  maxLength="1000"
                  size="md"
                  as="textarea" 
                  placeholder="Update for this week, etc..."
                  onChange={this.handleAnnouncementChange}
                  isInvalid={this.state.errors.announcement}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.errors["announcement"]}
                </Form.Control.Feedback>
              </Form.Group>          
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" type="button" onClick={this.handleCloseModal}>Cancel</Button>
            <Button variant="primary" type="button" onClick={this.saveAnnouncement}>Post</Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }


}

export default AnnounceForm;