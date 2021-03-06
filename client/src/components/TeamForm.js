import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { Form, Modal, Button, Row, Container } from 'react-bootstrap';
import { mapToDatabaseReadable } from '../utils';

import * as API from '../utils/api';

class TeamForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      name: '',
      created: new Date(),
      members: [], //stores new members by ID
      currentMembers: [], //stores currently selected members 
      oldMembers: [], //stores initial members (retrieved upon mounting)
      leader: '',
      currentLeader: '',
      description: '',
      interns: [],
      showModal: false,
      isLoading: true,
      errors: []
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
  handleCreatedChange = date => {
    this.setState({ created: date });
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
      errors["name"] = "Team name is required.";
    }
    if (!this.state.description) {
      errors["description"] = "Team description is required.";
    }

    this.setState({ errors: errors });

    if (errors["name"] || errors["description"]) {
      return false;
    } 
    return true;
  }

  // get basic team data and set states accordingly
  getTeamData = () => {
    this.setState({ isLoading: true });
    axios.post(API.TEAM_GET_SINGLE_API, { id: this.props.id })
      .then(res => {
        this.setState({
          name: res.data.name.trim(),
          currentMembers: res.data.members,
          oldMembers: res.data.members,
          leader: res.data.leader,
          currentLeader: res.data.leader || '',
          description: res.data.description.trim(),
          tasks: res.data.tasks,
          created: res.data.created
        })
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
  }

  // get possible interns to be added to team
  loadInterns = () => {
    this.setState({ isLoading: true });
    axios.get(API.INTERN_GET_API)
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
    var filteredArray = array.filter(function (el) { return el.id !== id; });
    this.setState({ currentMembers: filteredArray });
  }

  // add team to interns' "teams" attribute
  addTeamToInterns = data => {
    data.members.forEach(intern => {
      let teamToUpdate = {
        internId: intern.id,
        teamObject: { id: data._id || this.state.id, name: data.name || this.state.name }
      }
      axios.post(API.INTERN_ADD_TEAM_API, teamToUpdate);
    })
  }

  // remove team from interns' team attribute if they are no longer in it
  removeTeamFromInterns = data => {
    data.forEach(intern => {
      let teamToUpdate = {
        internId: intern.id,
        teamId: this.state.id
      }
      axios.post(API.INTERN_DELETE_TEAM_API, teamToUpdate);
    })
  }

  // create a team 
  createTeam = async () => {
    const validated = await this.handleValidation();
    if (validated) {
      const teamToCreate = {
        name: this.state.name.trim(),
        members: this.state.members ? this.state.members.map(mapToDatabaseReadable) : [],
        leader: this.state.leader,
        description: this.state.description.trim(),
        created: this.state.created
      }

      //post to team api 
      axios.post(API.TEAM_POST_API, teamToCreate)
        .then(res => {
          this.state.members.length > 0 && this.addTeamToInterns(res.data);
          this.props.updateParent();
        })
      this.handleCloseModal();
    }
  }

  // edit a team
  editTeam = async () => {
    const validated = await this.handleValidation();
    if (validated) {
      const teamToUpdate = {
        id: this.state.id,
        name: this.state.name.trim(),
        members: this.state.members.map(mapToDatabaseReadable).concat(this.state.currentMembers),
        leader: this.state.leader,
        description: this.state.description.trim(),
        created: this.state.created
      }

      // post the basic data to the team update API
      axios.post(API.TEAM_UPDATE_API, teamToUpdate)
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
          this.props.updateParent();
          this.getTeamData();
        })


      this.handleCloseModal();
    }
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
        <Container key={i}>
          <Row>
            <Button className="pt-0 pb-0 mt-0 mb-0" variant="danger" size="sm" onClick={() => this.removeCurrentMember(member.value)}>X</Button>
            <p> &nbsp;{member.label}</p>
          </Row>      
        </Container>
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
          size="lg"
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
                  isInvalid={this.state.errors.name}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.errors["name"]}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                  <h5 className="text-left">Current Members</h5>
                  {currentMembers}
                <Form.Label>Add Members</Form.Label>
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
                  as="textarea"
                  size="md"
                  type="text"
                  placeholder="Ex. Tasked with expanding CPMHA connections"
                  defaultValue={this.props.type === 'edit' ? this.state.description : ''}
                  onChange={this.handleDescriptionChange}
                  isInvalid={this.state.errors.description}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.errors["description"]}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Date Created &nbsp;</Form.Label><br/>
                <DatePicker
                  selected={this.props.type === 'edit' ? new Date(this.state.created) : new Date()}
                  onChange={this.handleCreatedChange}
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