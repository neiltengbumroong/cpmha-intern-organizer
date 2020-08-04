import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Select from 'react-select';


const TEAM_POST_API = 'http://localhost:5000/api/teams/post';
const INTERN_GET_API = 'http://localhost:5000/api/interns/get';

class TeamForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      members: [],
      leader: '',
      description: '',
      interns: [],
      showModal: false
    }

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleMembersChange = this.handleMembersChange.bind(this);
    this.handleLeaderChange = this.handleLeaderChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);

    this.createTeam = this.createTeam.bind(this);
    this.loadInterns = this.loadInterns.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);

  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }
  handleMembersChange(event) {
    this.setState({ members: event ? event.map(x => x.value) : [] });
  }
  handleLeaderChange(data) {
    this.setState({ leader: data.value });
  }
  handleDescriptionChange(event) {
    this.setState({ description: event.target.value });
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }
  
  handleCloseModal() {
    this.setState({ showModal: false });
  }

  loadInterns() {
    axios.get(INTERN_GET_API)
    .then(res => {
      this.setState({ 
        interns: res.data
      })
    })
  }

  createTeam() {
    const teamToCreate = {
      name: this.state.name,
      members: this.state.members,
      leader: this.state.leader,
      description: this.state.description,
    }

    axios.post(TEAM_POST_API, teamToCreate);  
    this.handleCloseModal();  
  }

  componentDidMount() {
    this.loadInterns();
  }

  render() {
    let options = [];
    let interns = this.state.interns;
    let leaderOptions = [];
    let members = this.state.members;
    for (let i = 0; i < interns.length; i++) {
      options.push({
        value: interns[i].name,
        label: interns[i].name
      })
    }

    for (let i = 0; i < members.length; i++) {
      leaderOptions.push({
        value: members[i],
        label: members[i]
      })
    }


    Modal.setAppElement('body');
    return (
      <>
        <button onClick={this.handleOpenModal}>Create Team</button>
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
          contentLabel="Create Team Modal">
          <form>
            <h1>New Team</h1>
            <label htmlFor="team">
              Team: &nbsp;
              <input id="team" type="text" onChange={this.handleNameChange}/><br/>
            </label>          
            <label htmlFor="members">Members: &nbsp;</label>
            <Select 
              options={options} 
              isMulti={true} 
              onChange={this.handleMembersChange}
            />
            <br/>

            <label htmlFor="leader"></label>
              Leader: &nbsp;
              <Select 
              options={leaderOptions} 
              isMulti={false} 
              onChange={this.handleLeaderChange}
              />
              
            <label htmlFor="description">
              Description: &nbsp;
              <textarea id="description" type="text" onChange={this.handleDescriptionChange}/><br/>
            </label>          
            
            <button type="button" onClick={this.createTeam}>Create Team</button>
            <button type="button" onClick={this.handleCloseModal}>Close</button>
          </form>
        </Modal>
      </>   
    )
  }
}

export default TeamForm;