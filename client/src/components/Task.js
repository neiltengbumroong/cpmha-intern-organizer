import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import TaskForm from './TaskForm';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const TASK_GET_SINGLE_API = 'http://localhost:5000/api/tasks/get/single';
const TASK_TOGGLE_COMPLETE_API = 'http://localhost:5000/api/tasks/toggle-completed';
const INTERN_TOGGLE_COMPLETE_API = 'http://localhost:5000/api/interns/toggle-completed';
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
  }

  // get task data to display and update state
  getTask = () => {
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
  deleteTaskFromTeam = taskId => {
    this.state.task.assignedToTeam.forEach(team => {
      const taskToDelete = {
        taskId: taskId,
        teamId: team.id
      }
      axios.post(TASKS_DELETE_FROM_TEAM_API, taskToDelete);
    })
  }

  // loop through each intern assigned to this task and remove it
  deleteTaskFromIntern = taskId => {
    this.state.task.assignedTo.forEach(intern => {
      const taskToDelete = {
        taskId: taskId,
        internId: intern.id
      }
      axios.post(TASKS_DELETE_FROM_INTERN_API, taskToDelete);
    })
  }

  // delete task document from collection
  deleteTask = taskId => {
    const id = { id: taskId };
    axios.post(TASKS_DELETE_API, id)
      .then(() => {
        // this.props.updateMain();
        // this.props.updateData();
      })
  }

  // delete task systematically - from team, then intern, then intern collection
  deleteTaskFull = taskId => {
    this.deleteTaskFromTeam(taskId);
    this.deleteTaskFromIntern(taskId);
    this.deleteTask(taskId);
  }

  toggleCompleted = () => {
    this.setState({ completed: !this.state.completed }, () => {
      axios.post(TASK_TOGGLE_COMPLETE_API, { taskId: this.state.task._id, completed: this.state.completed })
        .then(() => {
          window.location.reload();
        })
    });
  }

  componentDidMount() {
    this.getTask();
  }

  render() {
    let taskData = this.state.task;
    let assignedTo = [];
    let assignedToTeam = [];

    if (taskData.assignedTo) {
      assignedTo = taskData.assignedTo.map((intern, i) => (
        <span key={i}>
          { i > 0 && ", "}
          <Link to={{
            pathname: '/interns/' + intern.name,
            state: { id: intern.id }
          }}>{intern.name}</Link>
        </span>
      ))
    }

    if (taskData.assignedToTeam) {
      assignedToTeam = taskData.assignedToTeam.map((team, i) => (
        <span key={i}>
          { i > 0 && ", "}
          <Link to={{
            pathname: '/teams/' + team.name,
            state: { id: team.id }
          }}>{team.name}</Link>
        </span>
      ))
    }

    return (
      <div>
        {taskData.assignedTo ? 
          <div>
            <h5>{taskData.task}</h5>
            <p>{taskData.description}</p>
            <p>Deadline: {moment(taskData.deadline).format('LLLL')}</p>
            <p>{assignedTo.length > 0 && (
              <>
                {['Assigned to (Individuals): ',  assignedTo]}
              </>
            )}</p>
            <p>{assignedToTeam.length > 0 && (
              <>
                {['Assigned to (Teams): ',  assignedToTeam]}
              </>
            )}</p>
            <p>Link: <a href={taskData.link} target="_blank" rel="noopener noreferrer">{taskData.link}</a></p>
            {taskData.completed ? 
            <Button variant="success" disabled>Complete</Button> :
            <Button variant="success" onClick={this.toggleCompleted}>Complete</Button>}
            {this.props.view === 'other' ? null :
            <>
              <TaskForm
                type={"edit"}
                id={taskData._id}
              />
              <Button variant="danger" type="button" onClick={() => this.deleteTaskFull(taskData._id)}>Delete Task</Button>
              </>
            }
          </div>
          : null
        }
      </div>
    )
  }
}

export default Task;