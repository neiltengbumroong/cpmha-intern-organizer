import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import TaskForm from './TaskForm';
import Task from './Task';

import '../css/Tasks.css';

const TASKS_GET_API = 'http://localhost:5000/api/tasks/get';


class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      isLoading: false
    }

    this.loadTasks = this.loadTasks.bind(this);
   
  }

  loadTasks() {
    axios.get(TASKS_GET_API)
      .then(res => {
        this.setState({ 
          isLoading: true,
          tasks: res.data
        });
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
  }

  componentDidMount() {
    this.loadTasks();
  }

  render() {
    let tasks = null;
    if (!this.state.isLoading) {
      tasks = this.state.tasks.map((task, i) => 
      <div key={i}>
        <Task id={task._id} updateData={this.loadTasks} updateMain={this.props.updateMain}/>
        
      </div>
      )
    }
    return (
      <>
        <h1>Tasks</h1>
        <TaskForm updateData={this.loadTasks} updateMain={this.props.updateMain}/>
        {tasks}
      </>
    )
  }
}

export default Tasks;