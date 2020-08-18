import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Form, Modal, Col, Button, Container, Row } from 'react-bootstrap';
import DateTimePicker from 'react-datetime-picker';
import { mapToDatabaseReadable } from '../utils';

import * as API from '../utils/api';
import MASTER_KEY from '../utils/key';

class TaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      task: '',
      deadline: new Date(),
      description: '',
      dateAssigned: new Date(),
      assignedTo: [], // store new by id
      assignedToOld: [], // store initial
      assignedToCurrent: [], // store currently selected
      assignedToTeam: [], // store new by id
      assignedToTeamOld: [], // store initial
      assignedToTeamCurrent: [], // store new by id
      link: '',
      error: false,
      showModal: false,
      interns: [],
      teams: [],
      isLoading: true,
      errors: [],
      key: '',
      confirmKey: false
    }
  }

  handleTaskChange = event => {
    this.setState({ task: event.target.value });
  }
  handleDeadlineChange = event => {
    this.setState({ deadline: event });
  }
  handlePriorityChange = event => {
    this.setState({ priority: event.target.value });
  }
  handleDateAssignedChange = event => {
    this.setState({ dateAssigned: event.target.value });
  }
  handleDescriptionChange = event => {
    this.setState({ description: event.target.value });
  }
  handleAssignedToChange = event => {
    this.setState({ assignedTo: event ? event.map(x => x) : [] });
  }
  handleAssignedToTeamChange = event => {
    this.setState({ assignedToTeam: event ? event.map(x => x) : [] });
  }
  handleCompletedChange = () => {
    this.setState({ completed: !this.state.completed });
  }
  handleLinkChange = event => {
    this.setState({ link: event.target.value });
  }
  handleKeyChange = event => {
    this.setState({ key: event.target.value }, () => {
      if (this.state.key === MASTER_KEY) {
        this.setState({ confirmKey: true });
      } else {
        this.setState({ confirmKey: false });
      }
    });
  }

  handleOpenModal = () => {
    this.setState({ showModal: true });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  handleValidation = () => {
    let errors = {};
    if (!this.state.task) {
      errors["name"] = "Task name is required.";
    }
    if (!this.state.description) {
      errors["description"] = "Task description is required.";
    }

    this.setState({ errors: errors });

    if (errors["name"] || errors["description"]) {
      return false;
    } 
    return true;
  }

  // load data from teams and inters
  loadData = () => {
    this.setState({ isLoading: true });
    axios.all([
      axios.get(API.INTERN_GET_API),
      axios.get(API.TEAM_GET_API)
    ])
      .then(res => {
        this.setState({
          interns: res[0].data,
          teams: res[1].data
        })
      })
      .then(() => {
        // if we are only creating, then we are done 
        if (this.props.type === 'create') {
          this.setState({ isLoading: false });
        }
      })
  }

  // remove a current member from react-select
  removeCurrentAssigned = id => {
    var array = [...this.state.assignedToCurrent];
    var filteredArray = array.filter(function (el) { return el.id !== id; });
    this.setState({ assignedToCurrent: filteredArray });
  }

  // remove a current team from react-select
  removeCurrentTeam = id => {
    var array = [...this.state.assignedToTeamCurrent];
    var filteredArray = array.filter(function (el) { return el.id !== id; });
    this.setState({ assignedToTeamCurrent: filteredArray });
  }

  // load task data (for editing)
  getTaskData = () => {
    axios.post(API.TASK_GET_SINGLE_API, { id: this.props.id })
      .then(res => {
        this.setState({
          task: res.data.task,
          deadline: res.data.deadline,
          description: res.data.description,
          assignedToCurrent: res.data.assignedTo,
          assignedToOld: res.data.assignedTo,
          assignedToTeamCurrent: res.data.assignedToTeam,
          assignedToTeamOld: res.data.assignedToTeam,
          link: res.data.link,
          completed: res.data.completed
        })
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
  }

  editTask = async () => {
    const validated = await this.handleValidation();
    if (validated) {
      const taskToUpdate = {
        id: this.props.id,
        task: this.state.task,
        deadline: this.state.deadline,
        description: this.state.description,
        assignedTo: this.state.assignedTo.map(mapToDatabaseReadable).concat(this.state.assignedToCurrent),
        assignedToTeam: this.state.assignedToTeam.map(mapToDatabaseReadable).concat(this.state.assignedToTeamCurrent),
        link: this.state.link
      }
      axios.post(API.TASK_UPDATE_API, taskToUpdate)
        .then(res => {
          this.props.updateParent();
          this.getTaskData();
          // remove people no longer attached to the task
          const diffArrayIndividual = this.state.assignedToOld.filter(x => !this.state.assignedToCurrent.includes(x));
          this.removeTaskFromInterns(diffArrayIndividual);

          // remove teams no longer attached to the task
          const diffArrayTeam = this.state.assignedToTeamOld.filter(x => !this.state.assignedToTeamCurrent.includes(x));
          this.removeTaskFromTeams(diffArrayTeam);
        })
        .then(() => {
          // add any extra people to the task
          const addDataIndividual = {
            assignedTo: this.state.assignedTo.map(mapToDatabaseReadable),
            _id: this.state.id
          }
          this.addTaskToInterns(addDataIndividual);
          // add any extra teams to the task
          const addDataTeam = {
            assignedToTeam: this.state.assignedToTeam.map(mapToDatabaseReadable),
            _id: this.state.id
          }
          this.addTaskToTeams(addDataTeam);
        })

      this.handleCloseModal();
    }
  }

  // find all interns selected and add task
  addTaskToInterns = data => {
    data.assignedTo.forEach(intern => {
      const taskToUpdate = {
        internId: intern.id,
        taskObject: { id: data._id || this.state.id, task: data.task || this.state.task }
      }
      axios.post(API.INTERN_ADD_TASK_API, taskToUpdate);
    });
  }

  // method for adding a singular task to many teams
  addTaskToTeams = data => {
    data.assignedToTeam.forEach(team => {
      const taskToUpdate = {
        teamId: team.id,
        taskObject: { id: data._id || this.state.id, task: data.task || this.state.task }
      }
      axios.post(API.TEAM_ADD_TASK_API, taskToUpdate);
    });
  }

  // method for removing a singular task from interns
  removeTaskFromInterns = data => {
    data.forEach(element => {
      let taskToUpdate = {
        taskId: this.state.id,
        internId: element.id
      }
      axios.post(API.INTERN_DELETE_TASK_API, taskToUpdate);
    })
  }

  // method for removing a singular task from teams
  removeTaskFromTeams = data => {
    data.forEach(element => {
      let taskToUpdate = {
        taskId: this.state.id,
        teamId: element.id
      }
      axios.post(API.TEAM_DELETE_TASK_API, taskToUpdate);
    })
  }



  // standard task creation - add to interns and teams as well
  createTask = async () => {
    const validated = await this.handleValidation();
    if (validated) {
      const taskToCreate = {
        task: this.state.task,
        deadline: this.state.deadline,
        priority: this.state.priority,
        dateAssigned: this.state.dateAssigned,
        description: this.state.description,
        assignedTo: this.state.assignedTo ? this.state.assignedTo.map(mapToDatabaseReadable) : [],
        assignedToTeam: this.state.assignedToTeam ? this.state.assignedToTeam.map(mapToDatabaseReadable) : [],
        link: this.state.link
      }
      
      // post task and then add the response to teams and interns
      axios.post(API.TASK_POST_API, taskToCreate)
        .then((res) => {
          this.addTaskToInterns(res.data);
          this.addTaskToTeams(res.data);
          this.props.updateParent();
        })
        .catch(error => {
          this.setState({ error: true })
        })

      this.handleCloseModal();
      // window.location.reload();
    }
  }

  componentDidMount() {
    this.loadData();
    if (this.props.type === 'edit') {
      this.getTaskData();
    }
  }

  render() {
    let internOptions = [];
    let interns = this.state.interns;
    let teamOptions = [];
    let teams = this.state.teams;
    let currentAssigned = null;
    let currentAssignedDisplay = [];
    let currentTeams = null;
    let currentTeamsDisplay = [];

    if (!this.state.isLoading) {
      // if form is used for creation
      if (this.props.type === 'create') {
        // list intern options
        interns.forEach(intern => {   
          internOptions.push({
            value: intern._id,
            label: intern.name
          })
        })
        // list team options
        teams.forEach(team => {
          teamOptions.push({
            value: team._id,
            label: team.name
          })
        })
      } else {
        // if the intern is not assigned, add it to possibilities
        interns.forEach(intern => {
          if (!this.state.assignedToCurrent.some(e => e.id === intern._id)) {
            internOptions.push({
              value: intern._id,
              label: intern.name
            })
          } else {
            currentAssignedDisplay.push({
              value: intern._id,
              label: intern.name
            })
          }
        })

        teams.forEach(team => {
          if (!this.state.assignedToTeamCurrent.some(e => e.id === team._id)) {
            teamOptions.push({
              value: team._id,
              label: team.name
            })
          } else {
            currentTeamsDisplay.push({
              value: team._id,
              label: team.name
            })
          }
        })
      }

      currentAssigned = currentAssignedDisplay.map((intern, i) =>
        <Container key={i}>
          <Row>
            <Button className="pt-0 pb-0 mt-0 mb-0" variant="danger" size="sm" onClick={() => this.removeCurrentAssigned(intern.value)}>X</Button>
            <p> &nbsp;{intern.label}</p>
          </Row>       
        </Container>
      )
      currentTeams = currentTeamsDisplay.map((team, i) =>
        <Container key={i}>
          <Row>
            <Button className="pt-0 pb-0 mt-0 mb-0" variant="danger" size="sm" onClick={() => this.removeCurrentTeam(team.value)}>X</Button>
            <p> &nbsp;{team.label}</p>
          </Row>
        </Container>
      )
    }

    return (
      <>
        {this.props.type === 'edit' ?
          <Button className="btn-sm" onClick={this.handleOpenModal}>Edit Task</Button> :
          <Button variant="cpmha-dark-purple" className="btn-md" onClick={this.handleOpenModal}>Create Task</Button>}
        <Modal
          show={this.state.showModal}
          onHide={this.handleCloseModal}
          keyboard={false}
          backdrop="static"
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.props.type === 'edit' ? "Edit Task" : "New Task"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  size="md"
                  type="text"
                  maxLength="50"
                  placeholder="Ex. Reach out to school counselors"
                  defaultValue={this.props.type === 'edit' ? this.state.task : ''}
                  onChange={this.handleTaskChange}
                  isInvalid={this.state.errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.errors["name"]}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  size="md"
                  maxLength="300"
                  type="text"
                  placeholder="Ex. Follow this script when reaching out. Write down contact info... etc."
                  defaultValue={this.props.type === 'edit' ? this.state.description : ''}
                  onChange={this.handleDescriptionChange}
                  isInvalid={this.state.errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.errors["description"]}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Deadline</Form.Label><br/>
                <DateTimePicker
                  onChange={this.handleDeadlineChange}
                  value={this.state.deadline}
                  disableClock={true}
                />
              </Form.Group>
              <Form.Group>
                <h5>Currently Assigned (Individuals)</h5>
                {currentAssigned}
                <br/>    
                <Select
                  options={internOptions}
                  isMulti={true}
                  onChange={this.handleAssignedToChange}
                  isSearchable={true}
                />
              </Form.Group>
              <Form.Group>
                <h5>Currently Assigned (Teams)</h5>
                {currentTeams}
                <br/>
                <Select
                  options={teamOptions}
                  isMulti={true}
                  onChange={this.handleAssignedToTeamChange}
                  isSearchable={true}
                />
              </Form.Group>
              <Form.Group as={Row}>
                <Col sm={8}>
                  <Form.Label>Link</Form.Label>
                  <Form.Control
                    size="md"
                    type="text"
                    placeholder="Google Drive, Website, etc... (optional)"
                    defaultValue={this.props.type === 'edit' ? this.state.link : ''}
                    onChange={this.handleLinkChange}
                  />
                </Col>
                <Col sm={4}>
                  <Form.Label>Master Key</Form.Label>
                  <Form.Control
                  type="password"
                  size="md"
                  placeholder="Code"
                  onChange={this.handleKeyChange}
                />
                </Col>              
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" type="button" onClick={this.handleCloseModal}>Cancel</Button>
            {this.state.confirmKey ? 
              (this.props.type === 'edit' ?
              <Button variant="primary" type="button" onClick={this.editTask}>Save Changes</Button>
              :
              <Button variant="primary" type="button" onClick={this.createTask}>Create Task</Button>)
              :
              (this.props.type === 'edit' ?
              <Button variant="primary" type="button" disabled>Save Changes</Button>
              :
              <Button variant="primary" type="button" disabled>Create Task</Button>)
            }
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}

export default TaskForm;
