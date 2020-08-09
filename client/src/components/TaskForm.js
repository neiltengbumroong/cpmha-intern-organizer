import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import DateTimePicker from 'react-datetime-picker';
import DateTimeField from 'react-datetimepicker-bootstrap';

const TASK_POST_API = 'http://localhost:5000/api/tasks/post';
const TASK_GET_SINGLE_API = 'http://localhost:5000/api/tasks/get/single';
const INTERN_GET_API = 'http://localhost:5000/api/interns/get';
const TEAM_GET_API = 'http://localhost:5000/api/teams/get';
const INTERN_UPDATE_TASK_API = 'http://localhost:5000/api/interns/add-task';
const TEAM_UPDATE_TASK_API = 'http://localhost:5000/api/teams/add-task';

class TaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: '',
      deadline: new Date(),
      priority: '',
      dateAssigned: new Date(),
      assignedTo: [],
      assignedToOld: [],
      assignedToTeam: [],
      assignedToTeamOld: [],
      links: '',
      completed: false,
      error: false,
      showModal: false,
      interns: [],
      teams: []
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
    this.loadData = this.loadData.bind(this);
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
    this.setState({ assignedTo: event ? event.map(x => x.value) : [] });
  }
  handleAssignedToTeamChange(event) {
    this.setState({ assignedToTeam: event ? event.map(x => x.value) : [] });
  }
  handleCompletedChange() {
    this.setState({ completed: !this.state.completed });
  }
  handleLinksChange(event) {
    this.setState({ links: event.target.value });
  }

  handleOpenModal() {
    this.setState({ showModal: true });
    this.loadData();
  }
  
  handleCloseModal() {
    this.setState({ showModal: false });
  }

  // load data from teams and inters
  loadData() {
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
  }

  // load task data (for editing)
  getTaskData() {
    axios.post(TASK_GET_SINGLE_API, { id: this.props.id })
      .then(res => {
        this.setState({
          task: res.data.task,
          deadline: res.data.deadline,
          priority: res.data.priority,
          assignedToOld: res.data.assignedTo,
          assignedToTeamOld: res.data.assignedToTeam,
          links: res.data.links,
          completed: res.data.completed
        })
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
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

  addTaskToTeams(data) {
    for (let i = 0; i < data.assignedToTeam.length; i++) {
      let taskToUpdate = {
        teamId: data.assignedToTeam[i],
        taskId: data._id
      }
      axios.post(TEAM_UPDATE_TASK_API, taskToUpdate);
    }
  }

  createTask() {
    const taskToCreate = {
      task: this.state.task,
      deadline: this.state.deadline,
      priority: this.state.priority,
      dateAssigned: this.state.dateAssigned,
      assignedTo: this.state.assignedTo,
      assignedToTeam: this.state.assignedToTeam,
      completed: this.state.completed,
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
    for (let i = 0; i < interns.length; i++) {
      internOptions.push({
        value: interns[i]._id,
        label: interns[i].name
      })
    }

    let teamOptions = [];
    let teams = this.state.teams;
    for (let i = 0; i < teams.length; i++) {
      teamOptions.push({
        value: teams[i]._id,
        label: teams[i].name
      })
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
                placeholder="John Doe"
                defaultValue={this.props.type === 'edit' ? this.props.task : ''}  
                onChange={this.handleTaskChange}
              />
            </Form.Group>      
            <label htmlFor="deadline">
              Deadline: &nbsp;
              <DateTimePicker
                onChange={this.handleDeadlineChange}
                value={this.state.deadline}
                disableClock={true}       
              />
              <DateTimeField/>
            </label><br/>             
            <label>Assign to (Individual): &nbsp;</label>     
            <Select 
              options={internOptions} 
              isMulti={true} 
              onChange={this.handleAssignedToChange}
              isSearchable={true}
            />
            <br/>
            <label>Assign to (Team): &nbsp;</label>     
            <Select 
              options={teamOptions} 
              isMulti={true} 
              onChange={this.handleAssignedToTeamChange}
              isSearchable={true}
            />
            <br/>
            
            <label htmlFor="completed">
              Completed? &nbsp;
              <input id="completed" type="checkbox" onChange={this.handleCompletedChange}/><br/>
            </label>
            <label htmlFor="link">
              Links: &nbsp;
              <input id="link" type="text" onChange={this.handleLinksChange}/><br/>
            </label>   
            
            <button type="button" onClick={this.createTask}>Create Task</button>
            <button type="button" onClick={this.handleCloseModal}>Close</button>
          </Form>
        </Modal>
      </>   
    )
  }
}

export default TaskForm;