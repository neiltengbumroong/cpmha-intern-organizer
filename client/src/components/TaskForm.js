import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import DateTimePicker from 'react-datetime-picker';

const TASK_POST_API = 'http://localhost:5000/api/tasks/post';
const TASK_UPDATE_API = 'http://localhost:5000/api/tasks/update';
const TASK_GET_SINGLE_API = 'http://localhost:5000/api/tasks/get/single';
const INTERN_GET_API = 'http://localhost:5000/api/interns/get';
const TEAM_GET_API = 'http://localhost:5000/api/teams/get';
const INTERN_UPDATE_TASK_API = 'http://localhost:5000/api/interns/add-task';
const TEAM_UPDATE_TASK_API = 'http://localhost:5000/api/teams/add-task';
const TASKS_DELETE_FROM_INTERN_API = 'http://localhost:5000/api/interns/delete-task';
const TASKS_DELETE_FROM_TEAM_API = 'http://localhost:5000/api/teams/delete-task';

class TaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      task: '',
      deadline: new Date(),
      dateAssigned: new Date(),
      assignedTo: [], // store new by id
      assignedToOld: [], // store initial
      assignedToCurrent: [], // store currently selected
      assignedToTeam: [], // store new by id
      assignedToTeamOld: [], // store initial
      assignedToTeamCurrent: [], // store new by id
      links: '',
      error: false,
      showModal: false,
      interns: [],
      teams: [],
      isLoading: true
    }

    this.handleTaskChange = this.handleTaskChange.bind(this);
    this.handleDeadlineChange = this.handleDeadlineChange.bind(this);
    this.handlePriorityChange = this.handlePriorityChange.bind(this);
    this.handleDateAssignedChange = this.handleDateAssignedChange.bind(this);
    this.handleAssignedToChange = this.handleAssignedToChange.bind(this);
    this.handleAssignedToTeamChange = this.handleAssignedToTeamChange.bind(this);
    this.handleCompletedChange = this.handleCompletedChange.bind(this);
    this.handleLinksChange = this.handleLinksChange.bind(this);

    this.createTask = this.createTask.bind(this);
    this.editTask = this.editTask.bind(this);
    this.loadData = this.loadData.bind(this);
    this.removeCurrentAssigned = this.removeCurrentAssigned.bind(this);
    this.removeCurrentTeam = this.removeCurrentTeam.bind(this);
    this.addTaskToInterns = this.addTaskToInterns.bind(this);
    this.addTaskToTeams = this.addTaskToTeams.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);

  }

  handleTaskChange(event) {
    this.setState({ task: event.target.value });
  }
  handleDeadlineChange(date) {
    this.setState({ deadline: date });
  }
  handlePriorityChange(event) {
    this.setState({ priority: event.target.value });
  }
  handleDateAssignedChange(event) {
    this.setState({ dateAssigned: event.target.value });
  }
  handleAssignedToChange(event) {
    this.setState({ assignedTo: event ? event.map(x => x) : [] });
  }
  handleAssignedToTeamChange(event) {
    this.setState({ assignedToTeam: event ? event.map(x => x) : [] });
  }
  handleCompletedChange() {
    this.setState({ completed: !this.state.completed });
  }
  handleLinksChange(event) {
    this.setState({ links: event.target.value });
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }
  
  handleCloseModal() {
    this.setState({ showModal: false });
  }

  // load data from teams and inters
  loadData() {
    this.setState({ isLoading: true });
    axios.all([
      axios.get(INTERN_GET_API),
      axios.get(TEAM_GET_API)
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
  removeCurrentAssigned(id) {
    let array = [...this.state.assignedToCurrent];
    let index = array.indexOf(id);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ assignedToCurrent: array });
    }
  }

  removeCurrentTeam(id) {
    let array = [...this.state.assignedToTeamCurrent];
    let index = array.indexOf(id);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ assignedToTeamCurrent: array });
    }
  }

  // load task data (for editing)
  getTaskData() {
    axios.post(TASK_GET_SINGLE_API, { id: this.props.id })
      .then(res => {
        this.setState({
          task: res.data.task,
          deadline: res.data.deadline,
          assignedToCurrent: res.data.assignedTo,
          assignedToOld: res.data.assignedTo,
          assignedToTeamCurrent: res.data.assignedToTeam,
          assignedToTeamOld: res.data.assignedToTeam,
          links: res.data.links,
          completed: res.data.completed
        })
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
  }

  editTask() {
    const taskToUpdate = {
      id: this.props.id,
      task: this.state.task,
      deadline: this.state.deadline,
      assignedTo: this.state.assignedTo.map(x => x.value).concat(this.state.assignedToCurrent),
      assignedToTeam: this.state.assignedToTeam.map(x => x.value).concat(this.state.assignedToTeamCurrent),
      description: this.state.description,
      links: this.state.links
    }
    axios.post(TASK_UPDATE_API, taskToUpdate)
      .then(res => {
        // add any extra people to the task
        const addDataIndividual = {
          assignedTo: this.state.assignedTo.map(x => x.value),
          _id: this.state.id
        }
        this.addTaskToInterns(addDataIndividual);

        // remove people no longer attached to the task
        const diffArrayIndividual = this.state.assignedToOld.filter(x => !this.state.assignedToCurrent.includes(x));
        this.removeTaskFromInterns(diffArrayIndividual);

        // add any extra teams to the task
        const addDataTeam = {
          assignedToTeam: this.state.assignedToTeam.map(x => x.value),
          _id: this.state.id
        }
        this.addTaskToTeams(addDataTeam);

        // remove teams no longer attached to the task
        const diffArrayTeam = this.state.assignedToTeamOld.filter(x => !this.state.assignedToTeamCurrent.includes(x));
        this.removeTaskFromTeams(diffArrayTeam);
      })

    this.handleCloseModal();
    window.location.reload();
  }

  // find all interns selected and add task
  addTaskToInterns(data) {
    for (let i = 0; i < data.assignedTo.length; i++) {
      let taskToUpdate = {
        internId: data.assignedTo[i],
        taskId: data._id
      }
      axios.post(INTERN_UPDATE_TASK_API, taskToUpdate);
    }
  }

  // method for removing a singular task from interns
  removeTaskFromInterns(data) {
    data.forEach(element => {
      let taskToUpdate = {
        taskId: this.state.id,
        internId: element 
      }
      axios.post(TASKS_DELETE_FROM_INTERN_API, taskToUpdate);
    })
  }

  // method for removing a singular task from teams
  removeTaskFromTeams(data) {
    data.forEach(element => {
      let taskToUpdate = {
        taskId: this.state.id,
        teamId: element
      }

      axios.post(TASKS_DELETE_FROM_TEAM_API, taskToUpdate);
    })
  }

  // method for adding a singular task to many teams
  addTaskToTeams(data) {
    for (let i = 0; i < data.assignedToTeam.length; i++) {
      let taskToUpdate = {
        teamId: data.assignedToTeam[i],
        taskId: data._id
      }
      axios.post(TEAM_UPDATE_TASK_API, taskToUpdate);
    }
  }

  // standard task creation
  createTask() {
    const taskToCreate = {
      task: this.state.task,
      deadline: this.state.deadline,
      priority: this.state.priority,
      dateAssigned: this.state.dateAssigned,
      assignedTo: this.state.assignedTo.map(x => x.value),
      assignedToTeam: this.state.assignedToTeam.map(x => x.value),
      links: this.state.links
    }

    axios.post(TASK_POST_API, taskToCreate)
      .then((res) => {
        this.addTaskToInterns(res.data);
        this.addTaskToTeams(res.data);
        this.props.updateMain();
        this.props.updateData();
      })
      .catch(error => {
        this.setState({ error: true })
      })
      
    this.handleCloseModal(); 
    // window.location.reload();
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
          if (!this.state.assignedToCurrent.includes(intern._id)) {
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
          if (!this.state.assignedToTeamCurrent.includes(team._id)) {
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
        <div key={i}>
          <p>{intern.label}</p>
          <button type="button" onClick={() => this.removeCurrentAssigned(intern.value)}>X</button>
        </div>
      )

      currentTeams = currentTeamsDisplay.map((team, i) => 
      <div key={i}>
         <p>{team.label}</p>
          <button type="button" onClick={() => this.removeCurrentTeam(team.value)}>X</button>
      </div>
      )
      
    }
    

    Modal.setAppElement('body');
    return (
      <>
        <button onClick={this.handleOpenModal}>{this.props.type === 'edit' ? "Edit Task" : "Create Task"}</button>
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
          <Form>
            <h1>{this.props.type === 'edit' ? 'Edit Task' : 'New Task'}</h1>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control 
                size="md"
                type="text" 
                placeholder="Ex. Reach out to school counselors"
                defaultValue={this.props.type === 'edit' ? this.state.task : ''}  
                onChange={this.handleTaskChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Deadline</Form.Label>
              <DateTimePicker
                onChange={this.handleDeadlineChange}
                value={this.state.deadline}
                disableClock={true}       
              />
            </Form.Group>   
            <Form.Group>
              <Form.Label>Assign to (Individual)</Form.Label>
              {currentAssigned}   
              <Select 
                options={internOptions} 
                isMulti={true} 
                onChange={this.handleAssignedToChange}
                isSearchable={true}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Assign to (Team)</Form.Label>
              {currentTeams}   
              <Select 
                options={teamOptions} 
                isMulti={true} 
                onChange={this.handleAssignedToTeamChange}
                isSearchable={true}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Link</Form.Label>
              <Form.Control 
                size="md"
                type="text" 
                placeholder="Google Drive, Website, etc..."
                defaultValue={this.props.type === 'edit' ? this.state.links : ''}  
                onChange={this.handleLinksChange}
              />
            </Form.Group>   
            
            {this.props.type === 'edit' ? 
              <button type="button" onClick={this.editTask}>Save Changes</button>
              :
              <button type="button" onClick={this.createTask}>Create Task</button>
            }  
            <button type="button" onClick={this.handleCloseModal}>Close</button>
          </Form>
        </Modal>
      </>   
    )
  }
}

export default TaskForm;