import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { mapToDatabaseReadable } from '../utils';


const TEAM_POST_API = 'http://localhost:5000/api/teams/post';
const TEAM_UPDATE_API = 'http://localhost:5000/api/teams/update';
const TEAM_ADD_MEMBERS_API = 'http://localhost:5000/api/team/add-members';
const TEAM_GET_SINGLE_API = 'http://localhost:5000/api/teams/get/single';
const INTERN_GET_SINGLE_API = 'http://localhost:5000/api/interns/get/single';
const INTERN_GET_API = 'http://localhost:5000/api/interns/get';
const INTERN_UPDATE_TEAM_API = 'http://localhost:5000/api/interns/add-team';
const INTERN_DELETE_TEAM_API = 'http://localhost:5000/api/interns/delete-team';

class TeamForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      name: '',
      members: [], //stores new members by ID
      currentMembers: [], //stores currently selected members 
      oldMembers: [], //stores initial members (retrieved upon mounting)
      leader: '',
      currentLeader: '',
      description: '',
      interns: [],
      showModal: false,
      isLoading: true
    }
  }

  handleNameChange = event => {
    this.setState({ name: event.target.value });
  }
  handleMembersChange = event => {
    this.setState({ members: event ? event.map(x => x) : [] });
  }
  handleLeaderChange = data => {
    let tempData = data;
    tempData['id'] = data['value'];
    tempData['name'] = data['label'];
    this.setState({ leader: tempData });
  }
  handleDescriptionChange = event => {
    this.setState({ description: event.target.value });
  }

  handleOpenModal = () => {
    this.setState({ showModal: true });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  // get basic team data and set states accordingly
  getTeamData = () => {
    this.setState({ isLoading: true });
    axios.post(TEAM_GET_SINGLE_API, { id: this.props.id })
      .then(res => {
        this.setState({
          name: res.data.name,
          currentMembers: res.data.members,
          oldMembers: res.data.members,
          leader: res.data.leader,
          currentLeader: res.data.leader || '',
          description: res.data.description,
          tasks: res.data.tasks
        })
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
  }

  // get possible interns to be added to team
  loadInterns = () => {
    this.setState({ isLoading: true });
    axios.get(INTERN_GET_API)
      .then(res => {
        this.setState({
          interns: res.data
        })
      })
      .then(() => {
        if (this.props.type === 'create') {
          this.setState({ isLoading: false });
        }
      })
  }

  // remove a current member from react-select
  removeCurrentMember = id => {
    var array = [...this.state.currentMembers];
    var filteredArray = array.filter(function (el) { return el.id != id; });
    this.setState({ currentMembers: filteredArray });
  }

  // add team to interns' "teams" attribute
  addTeamToInterns = data => {
    data.members.forEach(intern => {
      let teamToUpdate = {
        internId: intern.id,
        teamObject: { id: data._id || this.state.id, name: data.name || this.state.name }
      }
      axios.post(INTERN_UPDATE_TEAM_API, teamToUpdate);
    })
  }

  // remove team from interns' team attribute if they are no longer in it
  removeTeamFromInterns = data => {
    data.forEach(intern => {
      let teamToUpdate = {
        internId: intern.id,
        teamId: this.state.id
      }
      axios.post(INTERN_DELETE_TEAM_API, teamToUpdate);
    })
  }

  // create a team 
  createTeam = () => {
    const teamToCreate = {
      name: this.state.name,
      members: this.state.members ? this.state.members.map(mapToDatabaseReadable) : [],
      leader: this.state.leader,
      description: this.state.description,
    }

    // post to team api 
    axios.post(TEAM_POST_API, teamToCreate)
      .then(res => {
        this.state.members.length > 0 && this.addTeamToInterns(res.data);
        this.props.updateData();
      })
    this.handleCloseModal();
  }

  // edit a team
  editTeam = () => {
    const teamToUpdate = {
      id: this.state.id,
      name: this.state.name,
      members: this.state.members.map(mapToDatabaseReadable).concat(this.state.currentMembers),
      leader: this.state.leader,
      description: this.state.description
    }

    // post the basic data to the team update API
    axios.post(TEAM_UPDATE_API, teamToUpdate)
      .then(res => {
        // remove team members no longer attached
        let diffArray = this.state.oldMembers.filter(x => !this.state.currentMembers.includes(x));
        this.removeTeamFromInterns(diffArray);
      })
      .then(() => {
        // add newly attached team members
        const addData = { members: [], _id: this.state.id };
        this.state.members.forEach(member => {
          addData["members"].push({
            id: member.value
          })
          this.addTeamToInterns(addData);
        })
      })
      .then(() => {
        this.props.updateData();
      })


    this.handleCloseModal();
    // "illusion" of change happening
    // window.location.reload();
  }

  componentDidMount() {
    this.loadInterns();
    // only load team data if we are editing
    if (this.props.type === 'edit') {
      this.getTeamData();
    }
  }

  render() {

    let options = [];
    let interns = null;
    let leaderOptions = [];
    let members = [];
    let currentMembers = null;
    let currentMembersDisplay = [];
    let currentLeader = null;

    if (!this.state.isLoading) {
      interns = this.state.interns; // get interns from state
      // switch for creating a team
      if (this.props.type === 'create') {
        members = this.state.members || [];
        interns.forEach(intern => {
          options.push({
            value: intern._id,
            label: intern.name
          })
        })
        members.forEach(member => {
          leaderOptions.push({
            value: member.value,
            label: member.label
          })
        })
        // else use this switch for editing
      } else {
        interns.forEach(intern => {
          if (!this.state.currentMembers.some(e => e.id === intern._id)) {
            options.push({
              value: intern._id,
              label: intern.name
            })
          } else {
            if (this.state.leader && intern._id === this.state.leader.id) {
              currentLeader = intern.name;
            }
            currentMembersDisplay.push({
              label: intern.name,
              value: intern._id
            })
          }
        })
        leaderOptions = [...currentMembersDisplay];
      }

      currentMembers = currentMembersDisplay.map((member, i) =>
        <div key={i}>
          <p>{member.label}</p>
          <p>{member.value}</p>
          <button type="button" onClick={() => this.removeCurrentMember(member.value)}>X</button>
        </div>
      )
    }

    return (
      <>
        <Button variant="info" onClick={this.handleOpenModal}>{this.props.type === 'edit' ? 'Edit Team' : 'Create Team'}</Button>
        <Modal 
          show={this.state.showModal}
          onHide={this.handleCloseModal}
          keyboard={false}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.props.type === 'edit' ? "Edit Team" : "New Team"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Team Name</Form.Label>
                <Form.Control
                  size="md"
                  type="text"
                  placeholder="Ex. Marketing"
                  defaultValue={this.props.type === 'edit' ? this.state.name : ''}
                  onChange={this.handleNameChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Add Members</Form.Label>
                {currentMembers}
                <Select
                  options={options}
                  isMulti={true}
                  onChange={this.handleMembersChange}
                  isSearchable={true}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Leader</Form.Label>
                <Select
                  options={leaderOptions}
                  isMulti={false}
                  onChange={this.handleLeaderChange}
                  placeholder={currentLeader}
                  isSearchable={true}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  size="md"
                  type="text"
                  placeholder="Ex. Tasked with expanding CPMHA connections"
                  defaultValue={this.props.type === 'edit' ? this.state.description : ''}
                  onChange={this.handleDescriptionChange}
                />
              </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" type="button" onClick={this.handleCloseModal}>Cancel</Button>
              {this.props.type === 'edit' ?
                <Button variant="primary" type="button" onClick={this.editTeam}>Save Changes</Button>
                :
                <Button variant="primary" type="button" onClick={this.createTeam}>Create Team</Button>
              }
            
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}

export default TeamForm;