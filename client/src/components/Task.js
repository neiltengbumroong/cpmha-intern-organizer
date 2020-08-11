import React, { Component } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';

const TASK_GET_SINGLE_API = 'http://localhost:5000/api/tasks/get/single';
const TASK_TOGGLE_COMPLETE_API = 'http://localhost:5000/api/tasks/toggle-completed';
const TASKS_DELETE_API = 'http://localhost:5000/api/tasks/delete';
const TASKS_DELETE_FROM_TEAM_API = 'http://localhost:5000/api/teams/delete-task';
const TASKS_DELETE_FROM_INTERN_API = 'http://localhost:5000/api/interns/delete-task';

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: [],
      completed: false,
      isLoading: true
    }
    this.getTask = this.getTask.bind(this);
    this.toggleCompleted = this.toggleCompleted.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.deleteTaskFromTeam = this.deleteTaskFromTeam.bind(this);
    this.deleteTaskFromIntern = this.deleteTaskFromIntern.bind(this);
  }

  // get task data to display and update state
  getTask() {
    this.setState({ isLoading: true });
    axios.post(TASK_GET_SINGLE_API, { id: this.props.id })
      .then(res => {
        this.setState({ 
          task: res.data,
          completed: res.data.completed
        });
        
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
  }

  // loop through each team assigned to this task and remove it
  deleteTaskFromTeam(taskId) {
    this.state.task.assignedToTeam.forEach(team => {
      const taskToDelete = {
        taskId: taskId,
        teamId: team.id
      }
      axios.post(TASKS_DELETE_FROM_TEAM_API, taskToDelete);
    })
  }

  // loop through each intern assigned to this task and remove it
  deleteTaskFromIntern(taskId) {
    this.state.task.assignedTo.forEach(intern => {
      const taskToDelete = {
        taskId: taskId,
        internId: intern.id
      }
      axios.post(TASKS_DELETE_FROM_INTERN_API, taskToDelete);
    })
  }

  // delete task document from collection
  deleteTask(taskId) {
    const id = { id: taskId };
    axios.post(TASKS_DELETE_API, id)
      .then(() => {
        this.props.updateMain();
        this.props.updateData();
      })
  }

  // delete task systematically - from team, then intern, then intern collection
  deleteTaskFull(taskId) {
    this.deleteTaskFromTeam(taskId);
    this.deleteTaskFromIntern(taskId);
    this.deleteTask(taskId);
  }

  toggleCompleted() {
    this.setState({ completed: !this.state.completed }, () => {
      axios.post(TASK_TOGGLE_COMPLETE_API, { taskId: this.state.task._id, completed: this.state.completed });
    });
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
          <p>Individual: {taskData.assignedTo.map(x => x.name)}</p>
          <p>Team: {taskData.assignedToTeam.map(x => x.name)}</p>
          <TaskForm
            type={"edit"}
            id={taskData._id}
          />
          <button onClick={this.toggleCompleted}>Complete</button>
          <button type="button" onClick={() => this.deleteTaskFull(taskData._id)}>Delete Task</button>
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