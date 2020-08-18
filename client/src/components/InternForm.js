import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { Form, Col, Button, Modal } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import '../css/custom.scss';

import * as API from '../utils/api';

class InternForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      name: '',
      school: '',
      major: '',
      email: '',
      phone: '',
      work: [],
      dateJoined: new Date(),
      showModal: false,
      errors: []
    }
  }

  handleNameChange = event => {
    this.setState({ name: event.target.value });
  }
  handleSchoolChange = event => {
    this.setState({ school: event.target.value });
  }
  handleMajorChange = event => {
    this.setState({ major: event.target.value });
  }
  handlePhoneChange = event => {
    this.setState({ phone: event.target.value });
  }
  handleEmailChange = event => {
    this.setState({ email: event.target.value });
  }
  handleDateJoinedChange = date => {
    this.setState({ dateJoined: date });
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
      errors["name"] = "Intern name is required.";
    }
    if (!this.state.email) {
      errors["email"] = "Intern email is required.";
    } else {
      let emailRegex = /[a-zA-Z]+[@][a-zA-Z]+[.][a-zA-Z]{3}$/gm;
      let validEmail = emailRegex.test(this.state.email);
      if (!validEmail) {
        errors["email"] = "Email is in invalid format. Ex. xx@cpmha.com"
      }
    }

    if (this.state.phone) {
      let phoneRegex = /[(][0-9]{3}[)][-][0-9]{3}[-][0-9]{4}$/gm;
      let validPhone = phoneRegex.test(this.state.phone);
      if (!validPhone) {
        errors["phone"] = "Phone number must be in exact (888)-888-8888 format.";
      }
    }

    this.setState({ errors: errors });
    if (errors["name"] || errors["email"] || errors["phone"]) {
      return false;
    } 
    return true;
  }

  // get intern data from database to pre-populate form for editing 
  getInternData = () => {
    this.setState({ isLoading: true });
    axios.post(API.INTERN_GET_SINGLE_API, { id: this.props.id })
      .then((res) => {
        this.setState({
          name: res.data.name,
          email: res.data.email,
          school: res.data.school,
          major: res.data.major,
          dateJoined: res.data.joined,
          phone: res.data.phone
        })
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
  }

  // create object with intern data, then post to database
  createIntern = async () => {
    const validated = await this.handleValidation();
    if (validated) {
      const internToCreate = {
        id: this.state.id,
        name: this.state.name,
        school: this.state.school,
        major: this.state.major,
        email: this.state.email,
        joined: this.state.dateJoined,
        phone: this.state.phone,
        teams: [],
        work: []
      }

      axios.post(API.INTERN_POST_API, internToCreate);
      this.props.updateParent();
      this.handleCloseModal();
    }
  }

  // create object to update document
  editIntern = async () => {
    const validated = await this.handleValidation();
    if (validated) {
      const internToEdit = {
        id: this.state.id,
        name: this.state.name,
        school: this.state.school,
        major: this.state.major,
        email: this.state.email,
        joined: this.state.dateJoined,
        phone: this.state.phone
      }
      axios.post(API.INTERN_UPDATE_API, internToEdit)
        .then(res => {
          this.getInternData();
          this.props.updateParent();
        })
        .catch(error => {
          this.setState({ error: true })
        })
      this.handleCloseModal();
    }
  }

  componentDidMount() {
    if (this.props.type === 'edit') {
      this.getInternData();
    }
  }

  render() {
    return (
      <>
        <Button onClick={this.handleOpenModal}>{this.props.type === 'create' ? "Create Intern" : "Edit Profile"}</Button>
        <Modal 
          show={this.state.showModal}
          onHide={this.handleCloseModal}
          keyboard={false}
          backdrop="static"
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.props.type === 'edit' ? "Edit Profile" : "New Intern"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control 
                  size="md"
                  type="text" 
                  maxLength="40"
                  placeholder="John Doe"
                  defaultValue={this.props.type === 'edit' ? this.state.name : ''}  
                  onChange={this.handleNameChange}
                  isInvalid={this.state.errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.errors["name"]}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  size="md"
                  type="email" 
                  placeholder="example@cpmha.com"
                  defaultValue={this.props.type === 'edit' ? this.state.email : ''}  
                  onChange={this.handleEmailChange}
                  isInvalid={this.state.errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.errors["email"]}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control 
                  size="md"
                  type="telephone" 
                  maxLength="14"
                  placeholder="(888)-888-8888"
                  defaultValue={this.props.type === 'edit' ? this.state.phone : ''}  
                  onChange={this.handlePhoneChange}
                  isInvalid={this.state.errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.errors["phone"]}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Row>
                <Col>
                  <Form.Group>
                    <Form.Label>School</Form.Label>
                    <Form.Control 
                      size="md"
                      type="text"
                      maxLength="50"
                      placeholder="School"
                      defaultValue={this.props.type === 'edit' ? this.state.school : ''}  
                      onChange={this.handleSchoolChange}
                    />
                </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Major</Form.Label>
                    <Form.Control 
                      size="md"
                      type="text"
                      maxLength="50"
                      placeholder="Major"
                      defaultValue={this.props.type === 'edit' ? this.state.major : ''}  
                      onChange={this.handleMajorChange}
                    />
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Group>
                <Form.Label>Date Joined &nbsp;</Form.Label><br/>
                <DatePicker
                  selected={this.props.type === 'edit' ? new Date(this.state.dateJoined) : new Date()}
                  onChange={this.handleDateJoinedChange}
                />
              </Form.Group>
            </Form> 
            <Modal.Footer>
              <Button variant="danger" type="button" onClick={this.handleCloseModal}>Cancel</Button>
              {this.props.type === 'edit' ? 
                <Button variant="primary" type="button" onClick={this.editIntern}>Save Changes</Button>
                :
                <Button variant="primary" type="button" onClick={this.createIntern}>Create Intern</Button>
              } 
            </Modal.Footer>
          </Modal.Body>  
        </Modal>
      </>
    )
  }
}

export default InternForm;