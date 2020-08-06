import React, { Component } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';

const TASK_GET_SINGLE_API = 'http://localhost:5000/api/tasks/get/single';
const TASKS_DELETE_API = 'http://localhost:5000/api/tasks/delete';
const TASKS_DELETE_FROM_TEAM_API = 'http://localhost:5000/api/teams/delete-task';
const TASKS_DELETE_FROM_INTERN_API = 'http://localhost:5000/api/interns/delete-task';

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: [],
      isLoading: true
    }
    this.getTask = this.getTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.deleteTaskFromTeam = this.deleteTaskFromTeam.bind(this);
    this.deleteTaskFromIntern = this.deleteTaskFromIntern.bind(this);
  }

  getTask() {
    axios.post(TASK_GET_SINGLE_API, { id: this.props.id })
      .then(res => {
        this.setState({ task: res.data });
        this.setState({ isLoading: true });
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
  }

  deleteTaskFromTeam(taskId) {
    for (let i = 0; i < this.state.task.assignedToTeam.length; i++) {
      const id = {
        teamId: this.state.task.assignedToTeam[i],
        taskId: taskId
      }
      axios.post(TASKS_DELETE_FROM_TEAM_API, id);
    }
  }

  deleteTaskFromIntern(taskId) {
    for (let i = 0; i < this.state.task.assignedTo.length; i++) {
      const id = {
        internId: this.state.task.assignedTo[i],
        taskId: taskId
      }
      axios.post(TASKS_DELETE_FROM_INTERN_API, id);
    }
  }

  deleteTask(taskId) {
    const id = { id: taskId };
    axios.post(TASKS_DELETE_API, id)
      .then(() => {
        this.props.updateMain();
        this.props.updateData();
      })
  }

  deleteTaskFull(taskId) {
    this.deleteTaskFromTeam(taskId);
    this.deleteTaskFromIntern(taskId);
    this.deleteTask(taskId);
  }

  componentDidMount() {
    this.getTask();
  }

  render() {
    let taskData = this.state.task;
    let task = null;

    if (!this.state.isLoading) {
      task = (
        <div>
          <h3>{taskData.task}</h3>
          <p>{taskData.deadline}</p>
          <button onClick={() => this.deleteTaskFull(taskData._id)}>Delete Task</button>
      </div>)
    }
    return (
      <div>
        {task}
      </div>
    )
  }
}

export default Task;