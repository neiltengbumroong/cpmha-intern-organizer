import React, { Component } from 'react';
import axios from 'axios';
import InternForm from './InternForm';
import ActivityForm from './ActivityForm';
import Header from './Header';
import Task from './Task';
import { Link } from "react-router-dom";
import { getAllInterns } from '../utils/index.js';
import moment from 'moment';
import { Jumbotron, Container, Row, Button, Col, Card, Modal, Form } from 'react-bootstrap';

import * as API from '../utils/api';
import MASTER_KEY from '../utils/key';

class Intern extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intern: [],
      interns: [],
      tasks: [],
      internId: props.location.state.id,
      showModal: false,
      showDeleteModal: false,
      delete: '',
      confirmDelete: false,
      key: '',
      confirmKey: false
    }
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

  handleDeleteChange = event => {
    this.setState({ delete: event.target.value }, () => {
      if (this.state.delete === this.state.intern.name) {
        this.setState({ confirmDelete: true });
      } else {
        this.setState({ confirmDelete: false });
      }
    });
  }

  handleOpenModal = () => {
    this.setState({ showModal: true });
  }
  handleCloseModal = () => {
    this.setState({ showModal: false });
  }
  handleOpenDeleteModal = () => {
    this.setState({ showDeleteModal: true });
  }
  handleCloseDeleteModal = () => {
    this.setState({ showDeleteModal: false });
  }

  handleDelete = () => {
    if (this.state.delete === this.state.intern.name) {
      return true;
    }
    return false;
  }

  // get intern data and set the state
  getIntern = () => {
    axios.post(API.INTERN_GET_SINGLE_API, { id: this.state.internId })
      .then(res => {
        this.setState({ 
          intern: res.data ,
          internId: res.data._id
        });
        this.getInternTasks();
      })
    getAllInterns()
      .then(res => {
        this.setState({ interns: res });
      })

  }

  getInternTasks = () => {
    // first, get all tasks directly associated with the intern
    this.state.intern.tasks.forEach(task => {
      axios.post(API.TASK_GET_SINGLE_API, { id: task.id })
        .then(res => {
          this.setState({ tasks: [...this.state.tasks, res.data]});
        })
        .then(() => {
        // then get all tasks assigned to the teams of the intern
          this.state.intern.teams.forEach(team => {
            axios.post(API.TEAM_GET_SINGLE_API, { id: team.id })
              .then(res => {
                // loop through each team's tasks
                res.data.tasks.forEach(task => {
                  // for each task, if it was already assigned to the intern
                  // individually then we skip it
                  if (!this.state.tasks.some(e => e._id === task.id)) {
                    axios.post(API.TASK_GET_SINGLE_API, { id: task.id })
                      .then(res => {
                        this.setState({ tasks: [...this.state.tasks, res.data]});
                      })
                  }      
                })
              })
          })
        })
    })
  }

  // remove intern from tasks' assignedTo attribute upon deletion
  deleteInternFromTask = internId => {
    this.state.intern.tasks.forEach(task => {
      const internToDelete = {
        internId: internId,
        taskId: task.id
      };
      axios.post(API.TASK_DELETE_INTERN_API, internToDelete);
    })
  }

  // remove intern from teams' tasks attribute upon deletion
  deleteInternFromTeam = internId => {
    this.state.intern.teams.forEach(team => {
      const internToDelete = {
        internId: internId,
        teamId: team.id
      }
      axios.post(API.TEAM_DELETE_MEMBER_API, internToDelete);
    })
  }

  // delete intern document from collection 
  deleteIntern = internId => {
    axios.post(API.INTERN_DELETE_API, { id: internId })
  }

  // when called, delete systematically from task, team, and then intern collections
  deleteInternFull = async(internId) => {
    this.deleteInternFromTask(internId);
    this.deleteInternFromTeam(internId);
    this.deleteIntern(internId);
  }

  componentDidMount() {
    this.getIntern();
  }

  componentDidUpdate() {
    // check if the props for the intern's id are different
    if (this.state.internId !== this.props.location.state.id) {
      // set new ID and clear out interns and tasks
      this.setState({ 
        internId: this.props.location.state.id,
        intern: [],
        tasks: []
      }, () => {
        // once state is set, scroll to the top of the intern page as well
        this.getIntern();
        // window.location.reload();
        window.scrollTo(0, 0);
      });    
    }
  }


  render() {
    const internData = this.state.intern;
    let internTeams = [];
    let internComplete = [];
    let internIncomplete = [];
    let internWork = [];
    let weeklyHours = 0;

    // append teams into a comma separated list of links
    if (internData.teams) {
      internTeams = internData.teams.map((team, i) => (
        <span key={i}>
          { i > 0 && ", "}
          <Link to={{
            pathname: '/teams/' + team.name,
            state: { id: team.id }
          }}>{team.name}</Link>
        </span>
      ))
    }

    // separate tasks into groups based on completion status
    if (this.state.tasks) {
      this.state.tasks.forEach(task => {
        if (task.completed) {
          internComplete.push(task);
        } else {
          internIncomplete.push(task);
        }
      })
    }

    // map activity into feed and count weekly hours
    if (internData.work) {
      internData.work.forEach(work => {
        if (moment(work.date).diff(new Date(), 'days') < 8) {
          weeklyHours = weeklyHours + work.hours;
        }
      })
      internWork = internData.work.map((work, i) => (
        <p key={i}>{moment(moment(work.date).utc(), "YYYYMMDD").fromNow()}: Spent <strong>{work.hours}</strong> {work.hours > 1 ? "hours" : "hour"} on <strong>{work.work}</strong></p>
      ))
    }

    return (
      <div>
        <Header/>
        {internData.tasks ? 
        <>
        <Jumbotron className="jumbotron-wrapper">
          <Container className="text-center">
            <Row>
              <Col><h1>{internData.name}</h1></Col>   
            </Row>
            <Row className="pb-3">
              <Col><h5>{internData.email}</h5></Col>
            </Row>
            <Row className="pt-3 pb-5">
              <Col>
                <h1>{weeklyHours}</h1>
                <p>Hours worked this week</p>
              </Col>
              <Col>
                <h1>{internData.totalHours}</h1>
                <p>Hours worked total</p>
              </Col>
              <Col>
                <h1>{internComplete.length}</h1>
                <p>Tasks Completed</p>
              </Col>
              <Col>
                <h1>{Math.round(moment.duration(moment(new Date()).diff(internData.joined)).asDays())}</h1>
                <p>Days at CPMHA</p>
              </Col>
            </Row>     
            <InternForm
              updateParent={this.getIntern}
              type={"edit"}
              id={internData._id}
            />{' '}
            <ActivityForm 
              updateParent={this.getIntern} 
              internId={internData._id} 
              name={internData.name} 
              tasks={internComplete.concat(internIncomplete)}
            />
          </Container>
        </Jumbotron>
        <Container className="main-background" fluid>
          <Row className="pt-5">
            <Col md={4} sm={12}>
              <Card>
                <Card.Body>
                  <Card.Title><h3>Intern Details</h3></Card.Title>
                    <hr/>
                    <p><strong>Email: </strong> {internData.email}</p>
                    <p><strong>Phone: </strong> {internData.phone}</p>
                    <p><strong>School: </strong> {internData.school}</p>
                    <p><strong>Major: </strong> {internData.major}</p>
                    <p><strong>Joined: </strong> {moment(internData.joined).format('MMMM Do, YYYY')}</p>
                    <p><strong>Teams: {internTeams}</strong> </p>
                </Card.Body>
              </Card>
              <Card className="mt-5">
                <Card.Body className="activity-scroll-column">
                  <Card.Title><h3>Activity Feed</h3></Card.Title>
                  <hr/>
                  {internWork.reverse()}
                </Card.Body>
              </Card>
              <Card className="mt-5 mb-5">
              <Card.Body>
                <Card.Title><h3>Other Interns</h3></Card.Title>
                  {this.state.interns.map((intern, i) => (
                    intern._id === this.state.internId ? '' : 
                    <div key={i}>
                      <Link to={{
                        pathname: '/interns/' + intern.name,
                        state: { id: intern._id }
                      }}>
                        {intern.name}
                      </Link>
                    </div>
                    ))
                  }       
              </Card.Body>
            </Card>
            </Col>
            <Col md={4} sm={12} className="text-center scroll-column border pt-2">
              <h2>Pending Tasks</h2>
              {internIncomplete.length > 0 ? internIncomplete.map((task, i) => (
              <div className="text-left mt-3 mb-3" key={i}>
                {i > 0 && <hr/>}
                <Task id={task._id} view={'other'}></Task>    
              </div>
            ))
            : <p className="mt-2">This intern currently has no pending tasks.</p>}
            </Col>
            <Col md={4} sm={12} className="text-center scroll-column border pt-2">
              <h2>Completed Tasks</h2>
              {internComplete.length > 0 ? internComplete.map((task, i) => (
              <div className="mt-3 mb-3 text-left" key={i}>
                {i > 0 && <hr/>}
                <Task id={task._id} view={'other'}></Task>
              </div>
            ))
            : <p className="mt-2">This intern has no completed tasks.</p>}
            </Col>
          </Row>
          <Row className="p-5 justify-content-center">
             <Button type="button" variant="danger" onClick={this.handleOpenDeleteModal}>Delete Intern</Button>
          </Row>
          <Modal
            show={this.state.showDeleteModal}
            onHide={this.handleCloseDeleteModal}
            keyboard={false}
            backdrop="static"
            size="lg"
          >
            <Modal.Header>
              <Modal.Title>Delete Intern</Modal.Title>
            </Modal.Header>         
            <Modal.Body>
              <h5>Are you sure you want to delete this intern? This action cannot be undone.</h5>
              <p>Deleting this intern will also subsequently remove them from all teams and tasks associated with them in the database. <strong>If this intern is the leader of a team, please make sure to change the leader before continuing as this may cause unexpected errors.</strong></p>
              <Form>
                <Form.Group as={Row}>
                  <Col sm={12} lg={9}>
                    <Form.Label>If you wish to continue, please type in the intern's name to confirm.</Form.Label>
                    <Form.Control
                      size="md"
                      type="text"
                      placeholder={this.state.intern.name}
                      onChange={this.handleDeleteChange}
                      required
                    />
                  </Col>
                  <Col sm={12} lg={3}>
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
              <Button variant="primary" onClick={this.handleCloseDeleteModal}>Cancel</Button>
              {this.state.confirmDelete && this.state.confirmKey ? 
                <Link to="/"><Button variant="danger" onClick={() => this.deleteInternFull(this.state.internId)}>Confirm</Button></Link>
                :
                <Button variant="danger" disabled>Confirm</Button>
              }        
            </Modal.Footer>
          </Modal>
        </Container>
        </>
        : 
        <h1>Loading</h1>}
      </div>
    )
  }
}

export default Intern;