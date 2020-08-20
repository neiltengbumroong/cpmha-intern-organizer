import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import TaskForm from './TaskForm';
import Loader from './Loader';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import * as API from '../utils/api';
import { TASK_KEY } from '../utils/key';

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: '',
      completed: false,
      isLoading: true,
      showDeleteModal: false,
      showCompleteModal: false,
      key: '',
      confirmKey: false
    }
  }

  handleOpenDeleteModal = () => {
    this.setState({ showDeleteModal: true });
  }
  handleCloseDeleteModal = () => {
    this.setState({ showDeleteModal: false });
  }
  handleOpenCompleteModal = () => {
    this.setState({ showCompleteModal: true });
  }
  handleCloseCompleteModal = () => {
    this.setState({ showCompleteModal: false });
  }
  handleKeyChange = event => {
    this.setState({ key: event.target.value }, () => {
      if (this.state.key === TASK_KEY) {
        this.setState({ confirmKey: true });
      } else {
        this.setState({ confirmKey: false });
      }
    });
  }

  // get task data to display and update state
  getTask = () => {
    this.setState({ 
      isLoading: true,
      task: ''
    });
    axios.post(API.TASK_GET_SINGLE_API, { id: this.props.id })
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
      axios.post(API.TEAM_DELETE_TASK_API, taskToDelete);
    })
  }

  // loop through each intern assigned to this task and remove it
  deleteTaskFromIntern = taskId => {
    this.state.task.assignedTo.forEach(intern => {
      const taskToDelete = {
        taskId: taskId,
        internId: intern.id
      }
      axios.post(API.INTERN_DELETE_TASK_API, taskToDelete);
    })
  }

  // delete task document from collection
  deleteTask = taskId => {
    const id = { id: taskId };
    axios.post(API.TASK_DELETE_API, id)
      .then(() => {
        this.props.updateParent();
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
      axios.post(API.TASK_TOGGLE_COMPLETE_API, { taskId: this.state.task._id, completed: this.state.completed })
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
        <span key={i + taskData.assignedTo.length}>
          {", "}
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
          <Row>
            <Col xs={12}>
              <h4>{taskData.task}</h4>
              <p className="p-task">{taskData.description}</p>
              <p className="p-task">Deadline: {moment(taskData.deadline).format('LLLL')}</p>
              <p className="p-task">Assigned to: {assignedTo.concat(assignedToTeam)}</p>
              <p className="p-task" style={{whiteSpace: "normal", wordWrap: "break-word"}}>Link: <a href={taskData.link} target="_blank" rel="noopener noreferrer">{taskData.link}</a></p>
              {this.props.view === 'other' ? 
                taskData.completed ? 
                null :
                <Button className="btn-sm" variant="success" onClick={this.handleOpenCompleteModal}>Complete</Button> :
              <>
                <TaskForm
                  type={"edit"}
                  id={taskData._id}
                  updateParent={this.getTask}
                />
                <Button className="btn-sm" variant="danger" type="button" onClick={this.handleOpenDeleteModal}>Delete Task</Button>
                </>
              }
            </Col>    
            <Modal
              show={this.state.showDeleteModal}
              onHide={this.handleCloseDeleteModal}
              keyboard={false}
              backdrop="static"
              size="lg"
            >
              <Modal.Header>
                <Modal.Title>Delete Task</Modal.Title>
              </Modal.Header>         
              <Modal.Body>
                <h5>Are you sure you want to delete this task?</h5>
                <p>This task will also be removed from all associated interns and teams in the database.</p>
                <Row>
                  <Col sm={3}>
                    <Form.Label>Task Key</Form.Label>
                    <Form.Control
                      type="password"
                      size="md"
                      placeholder="Code"
                      onChange={this.handleKeyChange}
                    />
                  </Col>            
                </Row>            
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={this.handleCloseDeleteModal}>Cancel</Button>
                {this.state.confirmKey ? 
                  <Button variant="danger" onClick={() => this.deleteTaskFull(taskData._id)}>Confirm</Button>
                  :
                  <Button variant="danger" disabled>Confirm</Button> 
                }         
              </Modal.Footer>
            </Modal>
            <Modal
              show={this.state.showCompleteModal}
              onHide={this.handleCloseCompleteModal}
              keyboard={false}
              backdrop="static"
              size="lg"
            >
              <Modal.Header>
                <Modal.Title>Complete Task</Modal.Title>
              </Modal.Header>         
              <Modal.Body>
                <h5>Are you sure you want to complete this task?</h5>
                <p>Make sure to double check with other teammates and/or assignees. You will still be able to log hours on completed tasks.</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={this.handleCloseCompleteModal}>Cancel</Button>
                <Button variant="success" onClick={this.toggleCompleted}>Confirm</Button>     
              </Modal.Footer>
            </Modal>
          </Row>
          : <Loader/>
        }
      </div>
    )
  }
}

export default Task;