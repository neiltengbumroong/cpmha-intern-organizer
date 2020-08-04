import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';


const TEAM_URL = 'http://localhost:5000/teams';

class TeamForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      members: [],
      leader: '',
      description: ''
    }

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleMembersChange = this.handleMembersChange.bind(this);
    this.handleLeaderChange = this.handleLeaderChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);

    this.createTeam = this.createTeam.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);

  }

  handleNameChange(event) {
    this.setState({ event: event.target.name });
  }
  handleMembersChange() {
    this.setState({ team: event.target.value});
  }
  handleLeaderChange() {
    this.setState({ leader: event.target.value });
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

  createTeam() {
    const teamToCreate = {
      name: this.state.name,
      members: this.state.members,
      leader: this.state.leader,
      description: this.state.description,
    }

    axios.post(TEAM_URL, teamToCreate);  
    this.handleCloseModal();  
  }

  render() {
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
          contentLabel="Create Task Modal">
          <form>
            <h1>New Team</h1>
            <label htmlFor="team">
              Team: &nbsp;
              <input id="team" type="text" onChange={this.handleNameChange}/><br/>
            </label>          
            <label htmlFor="members">
              Members: &nbsp;
              <input id="members" onChange={this.handleMembersChange}/><br/>
            </label>
            <label htmlFor="leader">
              Leader: &nbsp;
              <input id="leader" type="text" onChange={this.handleLeaderChange}/><br/>
            </label>  
            <label htmlFor="description">
              Description: &nbsp;
              <textarea id="description" type="text" onChange={this.handleDescriptionChange}/><br/>
            </label>          
            
            <button onClick={() => this.createTeam()}>Create Team</button>
            <button onClick={() => this.handleCloseModal()}>Close</button>
          </form>
        </Modal>
      </>   
    )
  }
}

export default TeamForm;