import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';

const TASK_POST_API = 'http://localhost:5000/api/tasks/post';
const INTERN_GET_API = 'http://localhost:5000/api/interns/get';
const TEAM_GET_API = 'http://localhost:5000/api/teams/get';
const INTERN_UPDATE_TASK_API = 'http://localhost:5000/api/interns/add-task';
const TEAM_UPDATE_TASK_API = 'http://localhost:5000/api/teams/add-task';

class TaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: '',
      deadline: '',
      priority: '',
      dateAssigned: new Date(),
      assignedTo: [],
      assignedToTeam: [],
      link: '',
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
    this.handleLinkChange = this.handleLinkChange.bind(this);

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
  handleLinkChange(event) {
    this.setState({ link: event.target.value });
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }
  
  handleCloseModal() {
    this.setState({ showModal: false });
  }

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
        this.props.updateData();
      })
      .catch(error => {
        this.setState({ error: true })
      })
      
    this.handleCloseModal(); 
  }

  componentDidMount() {
    this.loadData();
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
        <button onClick={this.handleOpenModal}>Create Task</button>
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
            <h1>New Task</h1>
            <label htmlFor="task">
              Task: &nbsp;
              <input id="task" type="text" onChange={this.handleTaskChange}/><br/>
            </label>            
            <label htmlFor="deadline">
              Deadline: &nbsp;
              <DateTimePicker
                onChange={this.handleDeadlineChange}
                value={this.state.deadline}
                disableClock={true}
              />
            </label>          
            <label htmlFor="priority"> 
              Priority: &nbsp;
              <select onChange={this.handlePriorityChange}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
                <option>N/A</option>
              </select><br/>
            </label>       
            <label>Assign to (Individual): &nbsp;</label>     
            <Select 
              options={internOptions} 
              isMulti={true} 
              onChange={this.handleAssignedToChange}
            />
            <br/>
            <label>Assign to (Team): &nbsp;</label>     
            <Select 
              options={teamOptions} 
              isMulti={true} 
              onChange={this.handleAssignedToTeamChange}
            />
            <br/>
            
            <label htmlFor="completed">
              Completed? &nbsp;
              <input id="completed" type="checkbox" onChange={this.handleCompletedChange}/><br/>
            </label>
            <label htmlFor="link">
              Link: &nbsp;
              <input id="link" type="text" onChange={this.handleLinkChange}/><br/>
            </label>   
            
            <button type="button" onClick={this.createTask}>Create Task</button>
            <button type="button" onClick={this.handleCloseModal}>Close</button>
          </form>
        </Modal>
      </>   
    )
  }
}

export default TaskForm;