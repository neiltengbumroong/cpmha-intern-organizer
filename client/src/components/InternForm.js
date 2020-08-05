import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Select from 'react-select';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const INTERN_POST_API = 'http://localhost:5000/api/interns/post';
const TEAM_GET_API = 'http://localhost:5000/api/teams/get';
const TEAM_UPDATE_MEMBERS_API = 'http://localhost:5000/api/team/update-members';

class InternForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  handleOpenModal() {
    this.setState({ showModal: true });
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
    console.log(data);
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
      })
      .catch(error => {
        this.setState({ error: true })
      })

    this.handleCloseModal(); 
  }

  componentDidMount() {
    this.loadTeams();
  }

  render() {
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
        <button onClick={this.handleOpenModal}>Create Intern</button>
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
          contentLabel="Create Intern Modal"
        >
          <form>
            <h1>New Intern</h1>
            <label htmlFor="name">
              Name: &nbsp;
              <input id="name" type="text" onChange={this.handleNameChange}/><br/>
            </label>            
            <label htmlFor="email">
              Email: &nbsp;
              <input id="email" type="email" onChange={this.handleEmailChange}/><br/>
            </label>
            <label htmlFor="school">
              School: &nbsp;
              <input id="school" type="text" onChange={this.handleSchoolChange}/><br/>
            </label>          
            <label htmlFor="major">
              Major: &nbsp;
              <input id="major" type="text" onChange={this.handleMajorChange}/><br/>
            </label>       
            <label htmlFor="date-joined">
              Date Joined: &nbsp;
              <DatePicker
                selected={new Date()}
                onChange={this.handleDateJoinedChange}
              />
            </label> <br/>
            <label htmlFor="teams">Teams:</label>
              <Select 
                options={options} 
                isMulti={true} 
                onChange={this.handleTeamsChange}
              />
            
            <button type="button" onClick={this.createIntern}>Create Intern</button>
            <button type="button" onClick={this.handleCloseModal}>Close</button>
          </form>
        </Modal>
      </>
    )
  }
}

export default InternForm;