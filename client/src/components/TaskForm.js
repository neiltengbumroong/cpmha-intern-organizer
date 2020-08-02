import React, { Component } from 'react';
import axios from 'axios';

const TASK_URL = 'http://localhost:5000/tasks';

class TaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: '',
      deadline: '',
      priority: '',
      dateAssigned: new Date(),
      assignedTo: [],
      completed: false,
      error: false
    }

    this.handleTaskChange = this.handleTaskChange.bind(this);
    this.handleDeadlineChange = this.handleDeadlineChange.bind(this);
    this.handlePriorityChange = this.handlePriorityChange.bind(this);
    this.handleDateAssignedChange = this.handleDateAssignedChange.bind(this);
    this.handleAssignedToChange = this.handleAssignedToChange.bind(this);
    this.handleCompletedChange = this.handleCompletedChange.bind(this);

    this.createTask = this.createTask.bind(this);

  }

  handleTaskChange(event) {
    this.setState({ task: event.target.value });
  }
  handleDeadlineChange(event) {
    this.setState({ deadline: event.target.value });
  }
  handlePriorityChange(event) {
    this.setState({ priority: event.target.value });
  }
  handleDateAssignedChange(event) {
    this.setState({ dateAssigned: event.target.value });
  }
  handleAssignedToChange(event) {
    this.setState({ assignedTo: event.target.value });
  }
  handleCompletedChange() {
    this.setState({ completed: !this.state.completed });
  }

  createTask(event) {
    event.preventDefault();
    const taskToCreate = {
      task: this.state.task,
      deadline: this.state.deadline,
      priority: this.state.priority,
      dateAssigned: this.state.dateAssigned,
      assignedTo: this.state.assignedTo,
      completed: this.state.completed,
    }

    axios.post(TASK_URL, taskToCreate)
      .catch(error => {
        this.setState({ error: true })
      })

    this.props.close();
    
  }

  render() {
    return (
      <form>
        <h1>New Task</h1>
        <label htmlFor="name">
          Task: &nbsp;
          <input id="name" type="text" onChange={this.handleTaskChange}/><br/>
        </label>            
        <label htmlFor="deadline">
          Deadline: &nbsp;
          <input id="deadline" type="date" onChange={this.handleDeadlineChange}/><br/>
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
        
        <label htmlFor="assign-to">
          Assign to: &nbsp;
          {/* get all interns and perform mapping with select and options */}
          <input id="assign-to" type="text" onChange={this.handleAssignedToChange}/><br/>
        </label>
        
        <label htmlFor="completed">
          Completed? &nbsp;
          <input id="completed" type="checkbox" onChange={this.handleCompletedChange}/><br/>
        </label>
        
        <button onClick={this.createTask}>Create Task</button>
        <button onClick={this.props.close}>Close</button>
      </form>
    )
  }
}

export default TaskForm;