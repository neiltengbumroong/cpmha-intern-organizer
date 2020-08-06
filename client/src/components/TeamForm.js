import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Select from 'react-select';


const TEAM_POST_API = 'http://localhost:5000/api/teams/post';
const INTERN_GET_API = 'http://localhost:5000/api/interns/get';
const INTERN_UPDATE_TEAM_API = 'http://localhost:5000/api/interns/add-team';

class TeamForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      members: [],
      tempMembers: [],
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
    this.addTeamToInterns = this.addTeamToInterns.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);

  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }
  handleMembersChange(event) {
    this.setState({ members: event ? event.map(x => x.value) : [] });
    this.setState({ tempMembers: event });
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

  addTeamToInterns(data) {
    for (let i = 0; i < data.members.length; i++) {
      let teamToUpdate = {
        internId: data.members[i],
        teamId: data._id
      }
      axios.post(INTERN_UPDATE_TEAM_API, teamToUpdate);
    }

    
  }

  createTeam() {
    const teamToCreate = {
      name: this.state.name,
      members: this.state.members,
      leader: this.state.leader,
      description: this.state.description,
    }

    axios.post(TEAM_POST_API, teamToCreate)
      .then(res => {
        this.addTeamToInterns(res.data);
        this.props.updateMain();
        this.props.updateData();
      })
    this.handleCloseModal();  
  }

  componentDidMount() {
    this.loadInterns();
  }

  render() {
    let options = [];
    let interns = this.state.interns;
    let leaderOptions = [];
    let members = this.state.tempMembers;
    for (let i = 0; i < interns.length; i++) {
      options.push({
        value: interns[i]._id,
        label: interns[i].name
      })
    }

    for (let i = 0; i < members.length; i++) {
      leaderOptions.push({
        value: members[i].value,
        label: members[i].label
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
              isSearchable={true}
            />
            <br/>

            <label htmlFor="leader"></label>
              Leader: &nbsp;
              <Select 
              options={leaderOptions} 
              isMulti={false} 
              onChange={this.handleLeaderChange}
              isSearchable={true}
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