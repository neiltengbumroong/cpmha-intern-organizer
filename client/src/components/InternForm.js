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
const INTERN_UPDATE_API = 'http://localhost:5000/api/interns/update';
const TEAM_GET_API = 'http://localhost:5000/api/teams/get';
const TEAM_UPDATE_MEMBERS_API = 'http://localhost:5000/api/team/add-members';

class InternForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      school: '',
      major: '',
      email: '',
      dateJoined: new Date(),
      teams: [],
      teamsOptions: [],
      showModal: false
    }

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSchoolChange = this.handleSchoolChange.bind(this);
    this.handleMajorChange = this.handleMajorChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleDateJoinedChange = this.handleDateJoinedChange.bind(this);
    this.handleTeamsChange = this.handleTeamsChange.bind(this);
    this.createIntern = this.createIntern.bind(this);
    this.loadTeams = this.loadTeams.bind(this);
    this.addInternToTeams = this.addInternToTeams.bind(this);
    this.editIntern = this.editIntern.bind(this);

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }
  handleSchoolChange(event) {
    this.setState({ school: event.target.value });
  }
  handleMajorChange(event) {
    this.setState({ major: event.target.value });
  }
  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }
  handleDateJoinedChange(date) {
    this.setState({ dateJoined: date });
  }
  handleTeamsChange(event) {
    this.setState({ teams: event ? event.map(x => x.value) : [] });
  }

  // set state with props here because for some reason they don't show up in constructor
  handleOpenModal() {
    this.setState({ 
      showModal: true,
      id: this.props.id,
      name: this.props.name,
      email: this.props.email,
      school: this.props.school,
      major: this.props.major
    });
  }
  
  handleCloseModal() {
    this.setState({ showModal: false });
  }

  loadTeams() {
    axios.get(TEAM_GET_API)
      .then(res => {
        this.setState({ teamsOptions: res.data })
      })
  }

  addInternToTeams(data) {
    for (let i = 0; i < data.teams.length; i++) {
      let internToUpdate = {
        id: data.teams[i],
        internId: data._id
      }
      axios.post(TEAM_UPDATE_MEMBERS_API, internToUpdate);
    }
  }

  createIntern(event) {
    event.preventDefault();
    const internToCreate = {
      id: this.state.id,
      name: this.state.name,
      school: this.state.school,
      major: this.state.major,
      email: this.state.email,
      joined: this.state.dateJoined,
      teams: this.state.teams
    }

    axios.post(INTERN_POST_API, internToCreate)
      .then(res => {
        this.addInternToTeams(res.data);
        this.props.updateMain();
        this.props.updateData();
      })
      .catch(error => {
        this.setState({ error: true })
      })

    this.handleCloseModal(); 
  }

  editIntern(event) {
    event.preventDefault();
    const internToEdit = {
      id: this.state.id,
      name: this.state.name,
      school: this.state.school,
      major: this.state.major,
      email: this.state.email,
      joined: this.state.dateJoined,
      teams: this.state.teams
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
    this.loadTeams();
  }

  render() {
    Modal.setAppElement("body");
    let options = [];
    let teams = this.state.teamsOptions;
    for (let i = 0; i < teams.length; i++) {
      options.push({
        value: teams[i]._id,
        label: teams[i].name,
      })
    }
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
                defaultValue={this.props.type === 'edit' ? this.props.name : ''}  
                onChange={this.handleNameChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control 
                size="md"
                type="email" 
                placeholder="example@cpmha.com"
                defaultValue={this.props.type === 'edit' ? this.props.email : ''}  
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
                    defaultValue={this.props.type === 'edit' ? this.props.school : ''}  
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
                    defaultValue={this.props.type === 'edit' ? this.props.major : ''}  
                    onChange={this.handleMajorChange}
                  />
                </Form.Group>
              </Col>
            </Form.Row>

            <Form.Group>
              <Form.Label>Date Joined </Form.Label>
              <DatePicker
                selected={this.props.type === 'edit' ? this.props.dateJoined : new Date()}
                onChange={this.handleDateJoinedChange}
              />
            </Form.Group>

            {this.props.type === 'create' ? 
              <Form.Group>
                <Form.Label>Add Teams </Form.Label>
                <Select 
                  options={options} 
                  isMulti={true} 
                  onChange={this.handleTeamsChange}
                />
              </Form.Group>       
              :
                null
            }
            
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