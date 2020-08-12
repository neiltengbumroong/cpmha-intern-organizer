import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Select from 'react-select';
// import DatePicker from "react-bootstrap-date-picker";
import DatePicker from 'react-datepicker';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import "react-datepicker/dist/react-datepicker.css";

const INTERN_POST_API = 'http://localhost:5000/api/interns/post';
const INTERN_GET_SINGLE_API = 'http://localhost:5000/api/interns/get/single';
const INTERN_UPDATE_API = 'http://localhost:5000/api/interns/update';
const TEAM_GET_API = 'http://localhost:5000/api/teams/get';
const TEAM_UPDATE_MEMBERS_API = 'http://localhost:5000/api/team/add-members';

class InternForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      name: '',
      school: '',
      major: '',
      email: '',
      dateJoined: new Date(),
      // teams: [],
      // teamsOptions: [],
      showModal: false
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
  handleEmailChange = event => {
    this.setState({ email: event.target.value });
  }
  handleDateJoinedChange = date => {
    this.setState({ dateJoined: date });
  }

  // set state with props here because for some reason they don't show up in constructor
  handleOpenModal = () => {
    this.setState({ showModal: true });
  }
  
  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  // get intern data from database to pre-populate form for editing 
  getInternData = () => {
    this.setState({ isLoading: true });
    axios.post(INTERN_GET_SINGLE_API, { id: this.props.id })
      .then((res) => {
        this.setState({
          name: res.data.name,
          email: res.data.email,
          school: res.data.school,
          major: res.data.major,
          dateJoined: res.data.joined
        })
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
  }

  // create object with intern data, then post to database
  createIntern = event => {
    const internToCreate = {
      id: this.state.id,
      name: this.state.name,
      school: this.state.school,
      major: this.state.major,
      email: this.state.email,
      joined: this.state.dateJoined,
      teams: []
    }

    axios.post(INTERN_POST_API, internToCreate)
      .then(res => {
        // this.addInternToTeams(res.data);
        this.props.updateMain();
        this.props.updateData();
      })
      .catch(error => {
        this.setState({ error: true })
      })

    this.handleCloseModal(); 
  }

  // create object to update document
  editIntern = event => {
    event.preventDefault();
    const internToEdit = {
      id: this.state.id,
      name: this.state.name,
      school: this.state.school,
      major: this.state.major,
      email: this.state.email,
      joined: this.state.dateJoined,
    }


    axios.post(INTERN_UPDATE_API, internToEdit)
      .then(res => {
        this.props.updateMain();
        this.props.updateData();
      })
      .catch(error => {
        this.setState({ error: true })
      })
    this.handleCloseModal();
    // "illusion" that something changed
    window.location.reload();
  }

  componentDidMount() {
    if (this.props.type === 'edit') {
      this.getInternData();
    }
  }

  render() {
    Modal.setAppElement("body");
    return (
      <>
        <button onClick={this.handleOpenModal}>{this.props.type === 'create' ? "Create Intern" : "Edit Profile"}</button>
        <Modal
          style={{
            content: {
              left: '20%',
              right: '20%',
              top: '15%',
              bottom: '15%',
            },
            overlay: {}
          }}
          isOpen={this.state.showModal}
          contentLabel="Intern Modal"
        >
          <Form>
            <h1>{this.props.type === 'edit' ? "Edit Profile" : "New Intern"}</h1>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control 
                size="md"
                type="text" 
                placeholder="John Doe"
                defaultValue={this.props.type === 'edit' ? this.state.name : ''}  
                onChange={this.handleNameChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control 
                size="md"
                type="email" 
                placeholder="example@cpmha.com"
                defaultValue={this.props.type === 'edit' ? this.state.email : ''}  
                onChange={this.handleEmailChange}
              />
            </Form.Group>

            <Form.Row>
              <Col>
                <Form.Group>
                  <Form.Label>School</Form.Label>
                  <Form.Control 
                    size="md"
                    type="text" 
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
                    placeholder="Major"
                    defaultValue={this.props.type === 'edit' ? this.state.major : ''}  
                    onChange={this.handleMajorChange}
                  />
                </Form.Group>
              </Col>
            </Form.Row>

            <Form.Group>
              <Form.Label>Date Joined </Form.Label>
              <DatePicker
                selected={this.props.type === 'edit' ? new Date(this.state.dateJoined) : new Date()}
                onChange={this.handleDateJoinedChange}
              />
            </Form.Group>
            
            {this.props.type === 'edit' ? 
              <button type="button" onClick={this.editIntern}>Save Changes</button>
              :
              <button type="button" onClick={this.createIntern}>Create Intern</button>
            }
            <button type="button" onClick={this.handleCloseModal}>Close</button>
          </Form>   
        </Modal>
      </>
    )
  }
}

export default InternForm;